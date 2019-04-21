import { User, Profile } from 'core/domain/users'
import { FriendTie } from 'core/domain/circles'

/**
 * User tie service interface
 *
 * @export
 * @interface IUserTieService
 */
export interface IFriendService {

  /**
   * Tie users
   */
  tieUseres: (userTieSenderInfo: FriendTie, userTieReceiveInfo: FriendTie, circleIds: string[])
    => Promise<void>

  /**
   * Update friend tie
   */
  updateFriendTie: (friendTieSenderInfo: FriendTie, friendTieReceiveInfo: FriendTie, accept: boolean)
  => Promise<void>

  /**
   * Remove users' tie
   */
  // removeUsersTie: (firstUserId: string, secondUserId: string)
  //   => Promise<void>

  /**
   * Get friend ties
   */
  getFriendTies: (userId: string)
    => Promise<{[userId: string]: FriendTie}>

  /**
   * Get friend ties
   */
  getFriendRequests: (userId: string)
  => Promise<{[userId: string]: FriendTie}>

  /**
   * Get all users
   */
  getAllUsers: (userId: string)
  => Promise<{[userId: string]: Profile}>
  /**
   * Get the users who tied current user
   */
  // getUserTieSender: (userId: string)
  //   => Promise<{[userId: string]: UserTie}>
}
