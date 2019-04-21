import { Circle, FriendTie } from 'src/core/domain/circles'
import { Profile } from 'src/core/domain/users'
import {Map} from 'immutable'

/**
 * Friend state
 */
export class FriendState {
  [key: string]: any
  /**
   * The list of users belong to users friend
   */
  friendTies: Map<string, FriendTie> = Map({})

  /**
   * The list of users belong to users friend requests
   */
  friendRequests: Map<string, FriendTie> = Map({})

  /**
   * The list of all users
   */
  allUsers: Map<string, Profile> = Map({})

  /**
   * The list of circle of current user
   */
  // circleList: Map<string, Circle> = Map({})

  /**
   * Whether select circle box is open for the selected user
   */
  // selectCircleStatus: { [userId: string]: boolean }

  /**
   * Whether following loading is shown for the selected user
   */
  // followingLoadingStatus: { [userId: string]: boolean }

  /**
   * Keep selected circles for refere user
   */
  // selectedCircles: Map<string, string[]> = Map({})

  /**
   * Whether the select circles box for referer user is open
   */
  // openSelecteCircles: { [userId: string]: boolean }

  /**
   * If user friend ties are loaded {true} or not {false}
   */
  friendTiesLoaded: boolean = false

  /**
   * If user friend requests are loaded {true} or not {false}
   */
  friendRequestsLoaded: boolean = false

  /**
   * If all users list are loaded {true} or not {false}
   */
  allUsersLoaded: boolean = false

  /**
   * Circle stting state
   */
  // openSetting: {[circleId: string]: boolean }
}
