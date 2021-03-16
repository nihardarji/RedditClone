import DataLoader from 'dataloader'
import { Updoot } from '../entities/Updoot'

export const createUpdootLoader = () => 
    new DataLoader<{ postId: number, userId: number }, Updoot | null>(async keys => {
        const votes = await Updoot.findByIds(keys as any)

        const voteIdsToVotes: Record<string, Updoot> = {}
        votes.forEach(vote => {
            voteIdsToVotes[`${vote.postId}|${vote.userId}`] = vote
        })

    return keys.map(key => voteIdsToVotes[`${key.postId}|${key.userId}`])
})