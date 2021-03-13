import { dedupExchange, fetchExchange, stringifyVariables } from 'urql'
import { cacheExchange, Resolver } from '@urql/exchange-graphcache'
import { ChangePasswordMutation, LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql'
import { betterUpdateQuery } from './betterUpdateQuery'

const cursorPagination = (): Resolver => {
    return (_parent, fieldArgs, cache, info) => {
        const { parentKey: entityKey, fieldName } = info
        // console.log(entityKey, fieldName)

        const allFields = cache.inspectFields(entityKey)
        // console.log('allFields',allFields)

        const fieldInfos = allFields.filter(info => info.fieldName === fieldName)
        const size = fieldInfos.length
        if (size === 0) {
            return undefined
        }

        const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`
        const isInTheCache = cache.resolve(
            cache.resolve(entityKey, fieldKey) as string,
            'posts'
        )

        info.partial = !isInTheCache
        
        let hasMore = true 
        const results: string[] = []
        fieldInfos.forEach(fi => {
            const key = cache.resolve(entityKey, fi.fieldKey) as string
            const data = cache.resolve(key, 'posts') as string[]
            const _hasMore = cache.resolve(key, 'hasMore')
            if(!_hasMore) {
                hasMore = _hasMore as boolean
            }
            results.push(...data)
        })

        return {
            __typename: 'PaginatedPosts',
            posts: results,
            hasMore
        }
    }
}

export const createUrqlClient = {
    url: '/graphql',
    fetchOptions: {
      credentials: 'include' as const
    },
    exchanges: [dedupExchange, cacheExchange({
        keys: {
            PaginatedPosts: () => null
        },
        resolvers: {
            Query: {
                posts: cursorPagination()
            }
        },
        updates: {
            Mutation: {
                changePassword: (_result, _args, cache, _info) => {
                    betterUpdateQuery<ChangePasswordMutation, MeQuery>(
                        cache,
                        { query: MeDocument },
                        _result,
                        (result, query) => {
                            if(result.changePassword.errors){
                                return query
                            } else {
                                return {
                                    me: result.changePassword.user
                                }
                            }
                        }
                    )
                },
                logout: (_result, _args, cache, _info) => {
                    betterUpdateQuery<LogoutMutation, MeQuery>(
                        cache,
                        { query: MeDocument },
                        _result,
                        () => ({ me: null })
                    )
                },
                login: (_result, _args, cache, _info) => {
                    betterUpdateQuery<LoginMutation, MeQuery>(
                        cache,
                        { query: MeDocument },
                        _result,
                        (result, query) => {
                            if(result.login.errors){
                                return query
                            } else {
                                return {
                                    me: result.login.user
                                }
                            }
                        }
                    )
                },
                register: (_result, _args, cache, _info) => {
                    betterUpdateQuery<RegisterMutation, MeQuery>(
                        cache,
                        { query: MeDocument },
                        _result,
                        (result, query) => {
                            if(result.register.errors){
                            return query
                            } else {
                            return {
                                me: result.register.user
                            }
                            }
                        }
                    )
                }
            }
        }
    }),
    fetchExchange
]}