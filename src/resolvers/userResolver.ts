import { MyContext } from '../types'
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql'
import { User } from '../entities/User'
import argon2 from 'argon2'
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX } from '../constants'
import { re, validateRegister } from '../utils/validateRegister'
import { UsernamePasswordInput } from './UsernamePasswordInput'
import { sendEmail } from '../utils/sendEmail'
import { v4 } from 'uuid'

@ObjectType()
class FieldError {
    @Field()
    field: string
    @Field()
    message: string
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]

    @Field(() => User, { nullable: true })
    user?: User
}

@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse)
    async changePassword(
        @Arg('token') token: string,
        @Arg('newPassword') newPassword: string,
        @Ctx() { redis, req }: MyContext
    ): Promise<UserResponse> {
        if(newPassword.length <= 5) {
            return { 
                errors: [{
                    field: "newPassword",
                    message: "password length must be greater than 5"
                }]
            }
        }

        const key = FORGOT_PASSWORD_PREFIX + token
        const userId = await redis.get(key)
        if(!userId){
            return {
                errors: [{
                    field: 'token',
                    message: 'Token expired'
                }]
            }
        }

        const userIdNum = parseInt(userId)
        const user = await User.findOne(userIdNum)

        if(!user){
            return {
                errors: [{
                    field: 'token',
                    message: 'user no longer exist'
                }]
            }
        }
        
        await User.update(
            { id: userIdNum },
            { password: await argon2.hash(newPassword) }
        )

        await redis.del(key)

        // login user after the password change
        req.session.userId = user.id

        return { user }
    }

    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg('email') email: string,
        @Ctx() { redis }: MyContext
    ) {
        const user = await User.findOne({ where: { email }})
        if(!user){
            // email not in db 
            return true
        }

        const token = v4()

        await redis.set(FORGOT_PASSWORD_PREFIX + token, user.id, 'ex', 1000 * 60 * 60 * 24 * 3) // 3 days

        await sendEmail(
            email,
            `<a href="http://localhost:3000/change-password/${token}">Reset Password</a>`
        )
        return true
    }

    @Query(() => User, { nullable: true })
    me(
        @Ctx() { req }: MyContext
    ) {
        // not logged in
        if(!req.session.userId){
            return null
        }
        
        return  User.findOne(req.session.userId)
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        const errors = validateRegister(options)
        if(errors){
            return { errors }
        }

        let user

        try {
            user = await User
                .create({
                    username: options.username,
                    email: options.email,
                    password: await argon2.hash(options.password)
                })
                .save()
        } catch (error) {
            if(error.detail.includes('already exists')){
                return {
                    errors: [{
                        field: "username",
                        message: "username already taken"
                    }]
                }
            }
        }

        req.session.userId = user?.id

        return { user }
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('usernameOrEmail') usernameOrEmail: string,
        @Arg('password') password: string,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        const user = await User.findOne(
            re.test(usernameOrEmail) 
            ? 
                { where: { email: usernameOrEmail } }
            : 
                { where: { username: usernameOrEmail } }
        )
        if(!user){
            return {
                errors: [{
                    field: "usernameOrEmail",
                    message: "Username or email doesn't exist"
                }]
            }
        }
        const valid = await argon2.verify(user.password, password)
        if(!valid){
            return { 
                errors: [{
                    field: "password",
                    message: "Incorrect Password"
                }]
            }
        }

        req.session.userId = user.id

        return { user }
    }

    @Mutation(() => Boolean)
    logout(@Ctx() { req, res }: MyContext ) {
        return new Promise((resolve) => {
            req.session.destroy((err) => {
                res.clearCookie(COOKIE_NAME)
                if(err){
                    resolve(false)
                    return
                }
                resolve(true)
            })
        })
    }
}