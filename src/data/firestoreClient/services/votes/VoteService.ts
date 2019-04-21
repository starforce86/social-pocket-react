// - Import react components
import { firebaseAuth, db } from 'data/firestoreClient'

import { SocialError } from 'core/domain/common'
import { Vote } from 'core/domain/votes'
import { IVoteService } from 'core/services/votes'
import { injectable } from 'inversify'
import { Post } from 'core/domain/posts/post'
import { VoteTargetType } from 'src/constants/voteActionType'

/**
 * Firbase vote service
 *
 * @export
 * @class VoteService
 * @implements {IVoteService}
 */
@injectable()
export class VoteService implements IVoteService {

  public addVote: (vote: Vote, voteTargetType: VoteTargetType)
    => Promise<string> = (vote, voteTargetType) => {
      return new Promise<string>((resolve,reject) => {
        const postRef = db.doc(`posts/${vote.postId}`)
        const collectionStr = this.getCollectionString(voteTargetType)
        let voteRef = postRef.collection(collectionStr).doc(vote.userId)
        .set({...vote})
        voteRef.then((result) => {
          resolve()
          /**
           * Add score
           */
          db.runTransaction((transaction) => {
            return transaction.get(postRef).then((postDoc) => {
              if (postDoc.exists) {
                const post = postDoc.data() as Post

                if (voteTargetType === VoteTargetType.HEART) {
                  
                  let {votes, score} = post
                  if (!votes) {
                    votes = {}
                  }
                  if (!score) {
                    score = 0
                  }
                  const newScore = score + 1
                  votes[vote.userId] = true
                  transaction.update(postRef, { votes: { ...votes}, score: newScore })

                } else if (voteTargetType === VoteTargetType.LAUGH) {

                  let {votesLaugh, scoreLaugh} = post
                  if (!votesLaugh) {
                    votesLaugh = {}
                  }
                  if (!scoreLaugh) {
                    scoreLaugh = 0
                  }
                  const newScore = scoreLaugh + 1
                  votesLaugh[vote.userId] = true
                  transaction.update(postRef, { votesLaugh: { ...votesLaugh}, scoreLaugh: newScore })

                } else if (voteTargetType === VoteTargetType.SMILE) {

                  let {votesSmile, scoreSmile} = post
                  if (!votesSmile) {
                    votesSmile = {}
                  }
                  if (!scoreSmile) {
                    scoreSmile = 0
                  }
                  const newScore = scoreSmile + 1
                  votesSmile[vote.userId] = true
                  transaction.update(postRef, { votesSmile: { ...votesSmile}, scoreSmile: newScore })

                } else if (voteTargetType === VoteTargetType.ANGRY) {

                  let {votesAngry, scoreAngry} = post
                  if (!votesAngry) {
                    votesAngry = {}
                  }
                  if (!scoreAngry) {
                    scoreAngry = 0
                  }
                  const newScore = scoreAngry + 1
                  votesAngry[vote.userId] = true
                  transaction.update(postRef, { votesAngry: { ...votesAngry}, scoreAngry: newScore })

                }
                
              }
            })
          })
        })
        .catch((error: any) => {
          reject(new SocialError(error.code,error.message))
        })
      })
    }
  public getVotes: (postId: string)
    => Promise<{ [postId: string]: { [voteId: string]: Vote } }> = (postId) => {
      return new Promise<{ [postId: string]: { [voteId: string]: Vote } }>((resolve,reject) => {
        let votesRef = db.doc(`posts/${postId}`).collection(`votes`)

        votesRef.onSnapshot((snapshot) => {
          let parsedData: {[postId: string]: {[voteId: string]: Vote}} = {[postId]: {}}
          snapshot.forEach((result) => {
            parsedData[postId][result.id] = {
              ...result.data() as Vote
            }
          })
          resolve(parsedData)
        })

      })
    }

  public deleteVote: (userId: string, postId: string, voteTargetType: VoteTargetType)
    => Promise<void> = (userId, postId, voteTargetType) => {
      return new Promise<void>((resolve,reject) => {
        const batch = db.batch()
        const postRef = db.doc(`posts/${postId}`)
        const collectionStr = this.getCollectionString(voteTargetType)
        let voteRef = postRef.collection(collectionStr).doc(userId)

        batch.delete(voteRef)
        batch.commit().then(() => {
          resolve()
          /**
           * Remove score
           */
          db.runTransaction((transaction) => {
            return transaction.get(postRef).then((postDoc) => {
              if (postDoc.exists) {
                const post = postDoc.data() as Post

                if (voteTargetType === VoteTargetType.HEART) {
                  let {votes, score} = post
                  if (!votes) {
                    votes = {}
                  }
                  if (!score) {
                    score = 0
                  }
                  const newScore = score - 1
                  votes[userId] = false
                  transaction.update(postRef, { votes: { ...votes}, score: newScore })
                } else if (voteTargetType === VoteTargetType.LAUGH) {
                  let {votesLaugh, scoreLaugh} = post
                  if (!votesLaugh) {
                    votesLaugh = {}
                  }
                  if (!scoreLaugh) {
                    scoreLaugh = 0
                  }
                  const newScore = scoreLaugh - 1
                  votesLaugh[userId] = false
                  transaction.update(postRef, { votesLaugh: { ...votesLaugh}, scoreLaugh: newScore })
                } else if (voteTargetType === VoteTargetType.SMILE) {
                  let {votesSmile, scoreSmile} = post
                  if (!votesSmile) {
                    votesSmile = {}
                  }
                  if (!scoreSmile) {
                    scoreSmile = 0
                  }
                  const newScore = scoreSmile - 1
                  votesSmile[userId] = false
                  transaction.update(postRef, { votesSmile: { ...votesSmile}, scoreSmile: newScore })
                } else if (voteTargetType === VoteTargetType.ANGRY) {
                  let {votesAngry, scoreAngry} = post
                  if (!votesAngry) {
                    votesAngry = {}
                  }
                  if (!scoreAngry) {
                    scoreAngry = 0
                  }
                  const newScore = scoreAngry - 1
                  votesAngry[userId] = false
                  transaction.update(postRef, { votesAngry: { ...votesAngry}, scoreAngry: newScore })
                }
                
              }
            })
          })
        })
        .catch((error) => {
          reject(new SocialError(error.code,error.message))
        })
      })
    }

  private getCollectionString: (voteTargetType: VoteTargetType) => string = (voteTargetType) => {
    let result: string = ''
    switch (voteTargetType) {
      case VoteTargetType.HEART:
        result = 'votes'
        break
      case VoteTargetType.LAUGH:
        result = 'votesLaugh'
        break
      case VoteTargetType.SMILE:
        result = 'votesSmile'
        break
      case VoteTargetType.ANGRY:
        result = 'votesAngry'
        break
      default:
        break
    }
    return result
  }
}
