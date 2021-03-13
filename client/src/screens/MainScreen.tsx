import React, { useState } from 'react'
import { Button, Card, ProgressBar, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { usePostsQuery } from '../generated/graphql'

interface MainScreenProps {}

const MainScreen: React.FC<MainScreenProps> = () => {
    const [variables, setVariables] = useState({
        limit: 10,
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
                data!.posts.posts.map(p => (
                    <Card key={p.id} className='my-4'>
                        <Card.Body>
                            <Card.Title>{p.title}</Card.Title>
                            {/* <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle> */}
                            <Card.Text>{p.textSnippet}</Card.Text>
                        </Card.Body>
                    </Card>
            ))}
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
