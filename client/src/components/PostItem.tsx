import React, { useState } from 'react'
import { Button, Card, Col, Row, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { PostSnippetFragment, useDeletePostMutation, useMeQuery, useVoteMutation } from '../generated/graphql'

interface PostItemProps {
    post: PostSnippetFragment
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
    const [isLoading, setIsLoading] = useState<'upvote-loading' | 'downvote-loading' | 'not-loading'>('not-loading')
    const { points, creator, title, textSnippet, id } = post

    const [{ data }] = useMeQuery()
    const [, vote] = useVoteMutation()
    const [, deletePost] = useDeletePostMutation()

    return (
        <Card className='my-4'>
            <Card.Body>
                <Row>
                    <Col xs={1} className='d-flex flex-column justify-content-center text-center p-1'>
                        <span>
                            <Button 
                                onClick={async () => {
                                    if(post.voteStatus === 1) {
                                        return
                                    }
                                    setIsLoading('upvote-loading')
                                    await vote({
                                        postId: post.id,
                                        value: 1
                                    })
                                    setIsLoading('not-loading')
                                }}
                                variant={post.voteStatus === 1 ? "outline-success" : 'outline-primary'}
                                className='btn-sm mb-1'
                                disabled={isLoading === 'upvote-loading'}
                            >
                                {isLoading === 'upvote-loading' ? 
                                    <Spinner animation="border" size="sm" />
                                    : <i className="fas fa-chevron-up"></i>
                                }
                                
                            </Button>
                        </span>
                        {points}
                        <span>
                            <Button
                                onClick={async () => {
                                    if(post.voteStatus === -1) {
                                        return
                                    }
                                    setIsLoading('downvote-loading')
                                    await vote({
                                        postId: post.id,
                                        value: -1
                                    })
                                    setIsLoading('not-loading')
                                }}
                                variant={post.voteStatus === -1 ? "outline-danger" : 'outline-primary'}
                                className='mt-1 btn-sm'
                                disabled={isLoading === 'downvote-loading'}
                            >
                                {isLoading === 'downvote-loading' ? 
                                    <Spinner animation="border" size="sm" />
                                    : <i className="fas fa-chevron-down"></i>
                                }
                            </Button>
                        </span>
                    </Col>
                    <Col xs={11}>
                        <div className='d-flex justify-content-between'>
                            <div className='flex-grow-1'>
                                <Link to={`/post/${id}`} className='card-title text-white lead'>{title}</Link>
                                <Card.Subtitle className="mb-3 mt-1">
                                    <span className='text-muted'>posted by</span> {creator.username}
                                </Card.Subtitle>
                                <Card.Text>{textSnippet}</Card.Text>
                            </div>
                            {data?.me?.id === post.creator.id && 
                                <div className='d-flex flex-column justify-content-around'>
                                    <Link className='btn btn btn-primary' to={`/post/edit/${post.id}`}>
                                        <i className="far fa-edit"></i>
                                    </Link>
                                    <Button
                                        variant='danger'
                                        onClick={() => {
                                            if(window.confirm('Are you sure?')){
                                                deletePost({ id: post.id })
                                            }
                                        }}
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </Button>
                                </div>
                            }
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

export default PostItem
