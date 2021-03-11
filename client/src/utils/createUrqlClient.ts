import { dedupExchange, fetchExchange } from 'urql'
import { cacheExchange } from '@urql/exchange-graphcache'
import { ChangePasswordMutation, LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql'
import { betterUpdateQuery } from './betterUpdateQuery'

export const createUrqlClient = {
    url: '/graphql',
    fetchOptions: {
      credentials: 'include' as const
    },
    exchanges: [dedupExchange, cacheExchange({
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