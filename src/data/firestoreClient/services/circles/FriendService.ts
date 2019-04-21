// - Import react components
import { datumString } from 'aws-sdk/clients/athena'
import firebase, {  firebaseAuth, db } from 'data/firestoreClient'
import moment from 'moment/moment'

import { SocialError } from 'core/domain/common'
import { Profile, UserProvider, User } from 'core/domain/users'
import { IFriendService } from 'core/services/circles'
import { inject, injectable } from 'inversify'
import { FirestoreClientTypes } from '../../firestoreClientTypes'
import { IGraphService } from '../graphs/IGraphService'
import { FriendGraph, Graph } from 'core/domain/graphs'
import { UserTie } from 'core/domain/circles'
import { FriendTie } from 'core/domain/circles'

/**
 * Firbase user service
 *
 * @export
 * @class UserTieService
 * @implements {IUserTieService}
 */
@injectable()
export class FriendService implements IFriendService {

  constructor (
    @inject(FirestoreClientTypes.GraphService) private _graphService: IGraphService
  ) {
  }

  /**
   * Tie users
   */
  public tieUseres: (userTieSenderInfo: FriendTie, userTieReceiveInfo: FriendTie, circleIds: string[])
    => Promise<void> = (userTieSenderInfo, userTieReceiveInfo, circleIds) => {
      return new Promise<void>((resolve, reject) => {

        this._graphService
        .addGraph(
          new FriendGraph(
            userTieSenderInfo.userId!,
            'TIE',
            userTieReceiveInfo.userId!,
            {...userTieSenderInfo},
            {...userTieReceiveInfo},
            {creationDate: Date.now(), circleIds},
            'requested'
          )
        ,'friends'
      ).then((result) => {
        resolve()

      })
      .catch((error: any) => reject(new SocialError(error.code, 'firestore/tieUseres :' + error.message)))
      })
    }

  /**
   * Update friend tie
   */
  public updateFriendTie: (friendTieSenderInfo: FriendTie, friendTieReceiveInfo: FriendTie, accept: boolean)
  => Promise<void> = (friendTieSenderInfo, friendTieReceiveInfo, accept) => {
    return new Promise<void>((resolve, reject) => {

      let status: string = 'denied'
      if (accept) {
        status = 'accepted'
      }

      this._graphService
      .updateFriendGraph(
        new FriendGraph(
          friendTieSenderInfo.userId!,
          'TIE',
          friendTieReceiveInfo.userId!,
          {...friendTieSenderInfo},
          {...friendTieReceiveInfo},
          {creationDate: Date.now()},
          status
        )
      ,'friends'
    ).then(() => {
      resolve()

    })
    .catch((error: any) => reject(new SocialError(error.code, 'firestore/updateFriendTie :' + error.message)))
    })
  }

  /**
   * Remove users' tie
   */
  // public removeUsersTie: (firstUserId: string, secondUserId: string)
  // => Promise<void> = (firstUserId, secondUserId) => {
  //   return new Promise<void>((resolve, reject) => {
  //     this.getUserTiesWithSeconUser(firstUserId,secondUserId).then((userTies) => {
  //       if (userTies.length > 0) {
  //         this._graphService.deleteGraphByNodeId(userTies[0].nodeId!).then(resolve)
  //       }
  //     })
  //     .catch((error: any) => reject(new SocialError(error.code, 'firestore/removeUsersTie :' + error.message)))
  //   })
  // }

  /**
   * Get friend ties
   */
  public getFriendTies: (userId: string)
  => Promise<{[userId: string]: FriendTie}> = (userId) => {
    return new Promise<{[userId: string]: FriendTie}>((resolve, reject) => {
      this._graphService
      .getOrGraphs(
        'friends',
        userId,
        'TIE',
        'accepted')
      .then((result) => {

        let parsedData: {[userId: string]: FriendTie} = {}
        result.forEach((node) => {
          const leftUserInfo: FriendTie = node.LeftMetadata
          const rightUserInfo: FriendTie = node.rightMetadata
          const metadata: {creationDate: number, circleIds: string[]} = node.graphMetadata
          if (leftUserInfo.userId === userId) {
            parsedData = {
              ...parsedData,
              [rightUserInfo.userId!] : {
                ...rightUserInfo,
              }
            }
          } else if (rightUserInfo.userId === userId) {
            parsedData = {
              ...parsedData,
              [leftUserInfo.userId!] : {
                ...leftUserInfo,
              }
            }
          }
          
        })
        resolve(parsedData)
      })
        .catch((error: any) => reject(new SocialError(error.code, 'firestore/getFriendTies :' + error.message)))
    })
  }

  /**
   * Get friend requests
   */
  public getFriendRequests: (userId: string)
  => Promise<{[userId: string]: FriendTie}> = (userId) => {
    return new Promise<{[userId: string]: FriendTie}>((resolve, reject) => {
      this._graphService
      .getGraphs(
        'friends',
        null,
        'TIE',
        userId,
        'requested')
      .then((result) => {

        let parsedData: {[userId: string]: FriendTie} = {}
        result.forEach((node) => {
          const leftUserInfo: FriendTie = node.LeftMetadata
          const rightUserInfo: FriendTie = node.rightMetadata
          const metadata: {creationDate: number, circleIds: string[]} = node.graphMetadata
          parsedData = {
            ...parsedData,
            [leftUserInfo.userId!] : {
              ...leftUserInfo
            }
          }
        })
        resolve(parsedData)
      })
        .catch((error: any) => reject(new SocialError(error.code, 'firestore/getFriendRequests :' + error.message)))
    })
  }

  /**
   * Get all users
   */
  public getAllUsers: (userId: string)
  => Promise<{[userId: string]: Profile}> = (userId) => {
    return new Promise<{[userId: string]: Profile}>((resolve, reject) => {
      let userInfoRef = db.collection(`userInfo`)
      userInfoRef.onSnapshot((snapshot) => {
        let parsedData: {[userId: string]: Profile} = {}
        snapshot.forEach((result) => {
          parsedData = {
            ...parsedData,
            [result.id] : new Profile(
              result.data().avatar || null,
              result.data().fullName || null,
              result.data().banner || null,
              result.data().tagLine || null,
              result.data().creationDate || null,
              result.data().email || null,
              result.data().birthday || null,
              result.data().webUrl || null,
              result.data().companyName || null,
              result.data().twitterId || null
            )
          }
        })
        resolve(parsedData)
      })
    })
  }

  /**
   * Get the users who tied current user
   */
  // public getUserTieSender: (userId: string)
  // => Promise<{[userId: string]: UserTie}> = (userId) => {
  //   return new Promise<{[userId: string]: UserTie}>((resolve, reject) => {
  //     this._graphService
  //     .getGraphs(
  //       'friends',
  //       null,
  //       'TIE',
  //       userId
  //     )
  //     .then((result) => {
  //       let parsedData: {[userId: string]: UserTie} = {}

  //       result.forEach((node) => {
  //         const leftUserInfo: UserTie = node.LeftMetadata
  //         const rightUserInfo: UserTie = node.rightMetadata
  //         const metada: {creationDate: number, circleIds: string[]} = node.graphMetadata
  //         parsedData = {
  //           ...parsedData,
  //           [leftUserInfo.userId!] : {
  //             ...leftUserInfo,
  //             circleIdList: []
  //           }
  //         }
  //       })
  //       resolve(parsedData)
  //     })
  //       .catch((error: any) => reject(new SocialError(error.code, 'firestore/getUserTieSender :' + error.message)))
  //   })
  // }

  /**
   * Get user ties with second user identifier
   */
  // private getUserTiesWithSeconUser: (userId: string, secondUserId: string)
  // => Promise<Graph[]> = (userId, secondUserId) => {
  //   return new Promise<Graph[]>((resolve, reject) => {
  //     this._graphService
  //     .getGraphs(
  //       'friends',
  //       userId,
  //       'TIE',
  //       secondUserId
  //     ).then(resolve)
  //     .catch(reject)
  //   })
  // }
}
