import { User } from 'core/domain/users'
import { Circle } from 'core/domain/circles/circle'
import { FriendTie } from 'core/domain/circles'
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType'
import { ServerRequestModel } from 'models/server/serverRequestModel'
import {Map, List} from 'immutable'
export interface IFriendBoxComponentProps {

    /**
     * User identifier
     */
  userId: string

  /**
   * User
   */
  user: FriendTie

  /**
   * Logined user identifier
   */
  loginUserId?: string

  /**
   * Avatar address
   */
  avatar?: string

  /**
   * User full name
   */
  fullName?: string

  /**
   * accept friend request
   */
  acceptFriend?: (userFriend: FriendTie, accept: boolean) => any

  /**
   * Redirect page to [url]
   */
  goTo?: (url: string) => any

  /**
   * The status of accepting friend server request
   */
  acceptRequest?: ServerRequestModel

  /**
   * The status of denying friend server request
   */
  denyRequest?: ServerRequestModel

  /**
   * Styles
   */
  classes?: any

  /**
   * Translate to locale string
   */
  translate?: (state: any, param?: {}) => any

  showButton?: boolean
}
