import React from 'react'
import { Button, Col, ProgressBar, Row } from 'react-bootstrap'
import { Link, RouteComponentProps } from 'react-router-dom'
import { useDeletePostMutation, useMeQuery, usePostQuery } from '../generated/graphql'

interface RouteParams { id: string }
interface PostScreenProps extends RouteComponentProps<RouteParams> {}

const PostScreen: React.FC<PostScreenProps> = ({ match, history }) => {
    const [{ data: meData }] = useMeQuery()
    const [, deletePost] = useDeletePostMutation()

    const intId = typeof match.params.id === 'string' ? parseInt(match.params.id) : -1
    const [{ data, fetching }] = usePostQuery({
        pause: intId === -1,
        variables: {
            id: intId
        }
    })
    if(fetching){
        return <ProgressBar now={100} animated />
    }

    if(!data?.post){
        return (
            <h4>No post found</h4>
        )
    }
    return (
        <>
            <Button variant='secondary' onClick={() => history.goBack()} className='my-2'>Back</Button>
            <Row>

                <Col xs={11}>
                    <h2 className='mb-4'>{data.post.title}</h2>
                    {data.post.text}
                </Col>
                {meData?.me?.id === data.post.creator.id && 
                    <Col xs={1} className='flex-column'>
                        <Link className='btn btn btn-primary mb-2' to={`/post/edit/${data.post.id}`}>
                            <i className="far fa-edit"></i>
                        </Link>
                        <Button
                            className='mt-2'
                            variant='danger'
                            onClick={async () => {
                                if(window.confirm('Are you sure?')){
                                    await deletePost({ id: intId })
                                    history.goBack()
                                }
                            }}
                        >
                            <i className="fas fa-trash-alt"></i>
                        </Button>
                    </Col>
                }
            </Row>
        </>
    )
}

export default PostScreen
