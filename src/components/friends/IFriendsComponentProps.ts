import { FriendTie } from 'core/domain/circles'
import {Map} from 'immutable'

export interface IFriendsComponentProps {

  /**
   * User friends info
   */
  friends?: Map<string, FriendTie>

  /**
   * Translate to locale string
   */
  translate?: (state: any) => any
}
