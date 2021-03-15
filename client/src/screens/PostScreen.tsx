import React from 'react'
import { ProgressBar } from 'react-bootstrap'
import { RouteComponentProps } from 'react-router-dom'
import { usePostQuery } from '../generated/graphql'

interface RouteParams { id: string }
interface PostScreenProps extends RouteComponentProps<RouteParams> {}

const PostScreen: React.FC<PostScreenProps> = ({ match }) => {
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
        return <h4>No post found</h4>
    }
    return (
        <>
            <h3>{data.post.title}</h3>
            {data.post.text}
        </>
    )
}

export default PostScreen
