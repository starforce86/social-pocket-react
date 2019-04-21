import { Profile } from 'core/domain/users'
import {Map} from 'immutable'
import { UserTie, FriendTie } from 'src/core/domain/circles'
export interface IFriendAddComponentProps {

    /**
     * If it's true post writing page will be open
     */
  open: boolean
    /**
     * Recieve request close function
     */
  onRequestClose: () => void
    /**
     * Post write style
     */
  style?: {}
    /**
     * The text of post in editing state
     */
  text?: string
    /**
     * If post state is editing this id sould be filled with post identifier
     */
  id?: string
  uid: string

  /**
   * User avatar address
   *
   * @type {string}
   * @memberof IFriendAddComponentProps
   */
  ownerAvatar?: string

  /**
   * The post owner name
   */
  ownerDisplayName?: string

  /**
   * Styles
   */
  classes?: any

  /**
   * Translate to locale string
   */
  translate?: (state: any) => any

  allUsers?: any
  friendRequests?: any
  friendTies?: any

  allUsersLoaded?: boolean
  friendRequestsLoaded?: boolean
  friendTiesLoaded?: boolean
  
  /**
   * Request a friend
   *
   * @memberof IFriendAddComponentProps
   */
  addFriend?: (userId: string, userFriend: UserTie, callBack: Function) => any,
  dispatch?: Function

}
