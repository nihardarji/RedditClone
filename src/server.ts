import 'reflect-metadata'
import express from 'express'
import { COOKIE_NAME, __prod__ } from './constants'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { PostResolver } from './resolvers/postResolver'
import { UserResolver } from './resolvers/userResolver'
import Redis from 'ioredis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import { createConnection } from 'typeorm'
import { Post } from './entities/Post'
import { User } from './entities/User'
import path from 'path'
import { Updoot } from './entities/Updoot'

(async () => {
    const conn = await createConnection({
        type: 'postgres',
        database: 'type-redditclone',
        username: 'postgres',
        logging: true,
        synchronize: true,
        migrations: [path.join(__dirname, './migrations/*')],
        entities: [ Post, User, Updoot ]
    })

    await conn.runMigrations()

    const app = express()

    const RedisStore = connectRedis(session)
    const redis = new Redis()

    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({ 
                client: redis,
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
        context: ({ req, res }) => ({ req, res, redis })
    })

    apolloServer.applyMiddleware({ app }) 

    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
        console.log(`Server started running on port ${PORT}`)
    })
})()
    .catch(err => console.log(err))
