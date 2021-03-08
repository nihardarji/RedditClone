import 'reflect-metadata'
import express from 'express'
import { MikroORM } from '@mikro-orm/core'
import { __prod__ } from './constants'
import microConfig from './mikro-orm.config'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { PostResolver } from './resolvers/postResolver'
import { UserResolver } from './resolvers/userResolver'
import redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import { MyContext } from './types'

(async () => {
    const orm = await MikroORM.init(microConfig)
    await orm.getMigrator().up()

    const app = express()

    const RedisStore = connectRedis(session)
    const redisClient = redis.createClient()

    app.use(
        session({
            name: 'reddit-id',
            store: new RedisStore({ 
                client: redisClient,
                disableTouch: true
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10 , // 10 years
                httpOnly: true,
                sameSite: 'lax', // related to csrf
                secure: false // cookie only works in https
            },
            saveUninitialized: false,
            secret: 'secret',
            resave: false,
        })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [ PostResolver, UserResolver ],
            validate: false
        }),
        // Context: special object that is accessible in all resolvers
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res })
    })

    apolloServer.applyMiddleware({ app }) 

    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
        console.log(`Server started running on port ${PORT}`)
    })
})()
    .catch(err => console.log(err))
