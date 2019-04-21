import { User } from 'core/domain/users'
import { UserTie } from 'core/domain/circles'
import {Map} from 'immutable'

export interface IFriendBoxListComponentProps {

    /**
     * Users in the circle
     *
     * @type {{[userId: string]: User}}
     * @memberof IFriendBoxListComponentProps
     */
  users: Map<string, UserTie>

    /**
     * User identifier
     *
     * @type {string}
     * @memberof IFriendBoxListComponentProps
     */
  uid?: string

  showButton?: boolean
}
