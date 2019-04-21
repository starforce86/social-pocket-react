import { User } from 'core/domain/users'
import { Vote } from 'core/domain/votes'
import { VoteTargetType } from 'src/constants/voteActionType'

/**
 * Vote service interface
 *
 * @export
 * @interface IVoteService
 */
export interface IVoteService {
  addVote: (vote: Vote, voteTargetType: VoteTargetType) => Promise<string>
  getVotes: (postId: string) => Promise<{[postId: string]: {[voteId: string]: Vote}}>
  deleteVote: (userId: string, voteId: string, voteTargetType: VoteTargetType) => Promise<void>
}
