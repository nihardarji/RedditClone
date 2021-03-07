import 'reflect-metadata'
import express from 'express'
import { MikroORM } from '@mikro-orm/core'
import { __prod__ } from './constants'
import microConfig from './mikro-orm.config'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { PostResolver } from './resolvers/postResolver'
import { UserResolver } from './resolvers/userResolver'

(async () => {
    const orm = await MikroORM.init(microConfig)
    await orm.getMigrator().up()

    const app = express()

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [ PostResolver, UserResolver ],
            validate: false
        }),
        // Context: special object that is accessible in all resolvers
        context: () => ({ em: orm.em })
    })

    apolloServer.applyMiddleware({ app }) 

    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
        console.log(`Server started running on port ${PORT}`)
    })
})()
    .catch(err => console.log(err))
