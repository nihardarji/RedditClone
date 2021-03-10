import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput"

export const re = /^[^@]+@\w+(\.\w+)+\w$/

export const validateRegister = (options: UsernamePasswordInput) => {
    if(!re.test(options.email)) {
        return [{
            field: "email",
            message: "invalid email"
        }]
    }
    if(options.username.includes("@")) {
        return [{
            field: "username",
            message: "cannot include @"
        }]
    }
    if(options.username.length <= 3) {
        return [{
            field: "username",
            message: "username length must be greater than 3"
        }]
    }
    if(options.password.length <= 5) {
        return [{
            field: "password",
            message: "password length must be greater than 5"
        }]
    }
    return null
}