import React from 'react'
import { usePostsQuery } from '../generated/graphql'

interface MainScreenProps {}

const MainScreen: React.FC<MainScreenProps> = () => {
    const [{ data }] = usePostsQuery()
    return (
        <div>
            {!data ? null : data.posts.map(p => <div key={p.id}>{p.title}</div>) }
        </div>
    )
}

export default MainScreen
