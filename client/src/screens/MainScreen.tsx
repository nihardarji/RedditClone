import React, { useState } from 'react'
import { Button, ProgressBar, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PostItem from '../components/PostItem'
import { usePostsQuery } from '../generated/graphql'
import { PAGINATION_LIMIT } from '../utils/constants'

interface MainScreenProps {}

const MainScreen: React.FC<MainScreenProps> = () => {
    const [variables, setVariables] = useState({
        limit: PAGINATION_LIMIT,
        cursor: null as null | string
    })

    const [{ data, fetching }] = usePostsQuery({ variables })

    if(!fetching && !data) {
        return <div>Query failed for some reason</div>
    }
    return (
        <>
            <Link to='create-post'>Create Post</Link>
            {!data && fetching 
            ? 
                <ProgressBar now={100} animated /> 
            : 
                data!.posts.posts.map(p => <PostItem key={p.id} post={p} />)
            }
            {data && data.posts.hasMore && <div className='d-flex justify-content-center'>
                <Button
                    className='my-2'
                    type='submit'
                    color='primary'
                    disabled={fetching}
                    onClick={() => {
                        setVariables({
                            limit: variables.limit,
                            cursor: data.posts.posts[data.posts.posts.length - 1].createdAt
                        })
                    }}
                >
                    {fetching && <Spinner className='mr-1' animation='border' size='sm' />} Load More
                </Button>
            </div>}
        </>
    )
}

export default MainScreen
