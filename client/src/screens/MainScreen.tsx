import React from 'react'
import { Link } from 'react-router-dom'
import { usePostsQuery } from '../generated/graphql'

interface MainScreenProps {}

const MainScreen: React.FC<MainScreenProps> = () => {
    const [{ data }] = usePostsQuery()
    return (
        <>
            <Link to='create-post'>Create Post</Link>
            {!data ? null : data.posts.map(p => <div key={p.id}>{p.title}</div>) }
        </>
    )
}

export default MainScreen
