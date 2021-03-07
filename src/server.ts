import { MikroORM } from '@mikro-orm/core'
import { __prod__ } from './constants'
import { Post } from './entities/Post'
import microConfig from './mikro-orm.config'

const main = async () => {
    const orm = await MikroORM.init(microConfig)
    await orm.getMigrator().up()

    const posts = await orm.em.find(Post, {})
    console.log(posts)
}

main()
    .catch(err => console.log(err))