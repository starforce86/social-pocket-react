import {  db } from 'data/firestoreClient'
// - Import domain
import { Profile, User } from 'src/core/domain/users'
import { Circle, FriendTie } from 'src/core/domain/circles'
import { SocialError } from 'src/core/domain/common'
import * as moment from 'moment/moment'
import { Map, List, fromJS } from 'immutable'

// - Import action types
import { FriendActionType } from 'constants/friendActionType'

// - Import actions
import * as globalActions from 'store/actions/globalActions'
import * as userActions from 'store/actions/userActions'
import * as notifyActions from 'store/actions/notifyActions'
import * as serverActions from 'store/actions/serverActions'
import * as friendActions from 'store/actions/friendActions'

import { ICircleService } from 'src/core/services/circles'
import { SocialProviderTypes } from 'src/core/socialProviderTypes'
import { provider } from 'src/socialEngine'
import { IFriendService } from 'src/core/services/circles'
import StringAPI from 'src/api/StringAPI'
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType'
import { ServerRequestType } from 'constants/serverRequestType'
import { ServerRequestModel } from 'src/models/server/serverRequestModel'

/**
 * Get service providers
 */
const circleService: ICircleService = provider.get<ICircleService>(SocialProviderTypes.CircleService)
const friendService: IFriendService = provider.get<IFriendService>(SocialProviderTypes.FriendService)

/* _____________ CRUD DB _____________ */

/**
 * Add a circle
 * @param {string} circleName
 */
// export let dbAddCircle = (circleName: string) => {
//   return (dispatch: any, getState: Function) => {

//     const state: Map<string, any>  = getState()
//     let uid: string = state.getIn(['authorize', 'uid'])
//     let circle: Circle = {
//       creationDate: moment().unix(),
//       name: circleName,
//       isSystem : false,
//       ownerId: uid
//     }
//     return circleService.addCircle(uid, circle).then((circleKey: string) => {
//       circle.id = circleKey
//       circle.ownerId = uid
//       dispatch(addCircle(Map(circle)))

//     }, (error: SocialError) => dispatch(globalActions.showMessage(error.message)))

//   }
// }

/**
 * Add referer user to the `Following` circle of current user
 */
export const dbAddFriend = (userId: string, userFriend: FriendTie, callBack: Function) => {
  return (dispatch: Function, getState: Function) => {

    dispatch(globalActions.showTopLoading())

    const state: Map<string, any>  = getState()
    let uid: string = state.getIn(['authorize', 'uid'])
    let user: User = { ...state.getIn(['user', 'info', uid]), userId: uid }

    // Set server request status to {Sent} for following user
    // const followReqestModel = createFollowRequest(userFollowing.userId!)
    // dispatch(serverActions.sendRequest(followReqestModel))

    // Call server API
    return friendService.tieUseres(
      { userId: user.userId!, fullName: user.fullName, avatar: user.avatar, approved: false },
      { userId: userFriend.userId!, fullName: userFriend.fullName, avatar: userFriend.avatar, approved: false },
      [userId]
    )
      .then(() => {
        let friendTie: Map<string, any> = Map(new FriendTie(
          userFriend.userId!,
          moment().unix(),
          userFriend.fullName,
          userFriend.avatar,
          false,   
      ))
      // friendTie = friendTie.set('circleIdList', List([userId]))

        // dispatch(addFollowingUser(userTie))

        // Set server request status to {OK} for following user
        // followReqestModel.status = ServerRequestStatusType.OK
        // dispatch(serverActions.sendRequest(followReqestModel))

        // Send notification
        dispatch(notifyActions.dbAddNotification(
          {
            description: `${user.fullName} requested to add you as friend.`,
            url: `/${uid}`,
            notifyRecieverUserId: userFriend.userId as string,
            notifierUserId: uid,
            isSeen: false
          }))

          dispatch(friendActions.dbGetFriendRequests())
          callBack()
          dispatch(globalActions.hideTopLoading())

      }, (error: SocialError) => {
        dispatch(globalActions.showMessage(error.message))

        // Set server request status to {Error} for following user
        // followReqestModel.status = ServerRequestStatusType.Error
        // dispatch(serverActions.sendRequest(followReqestModel))

        dispatch(globalActions.hideTopLoading())
      })
  }
}

/**
 * accept friend request
 */
export let dbAcceptFriend = (userFriend: FriendTie, accept: boolean) => {
  return (dispatch: any, getState: Function) => {
    const state: Map<string, any>  = getState()
    let uid: string = state.getIn(['authorize', 'uid'])
    let user: User = { ...state.getIn(['user', 'info', uid]), userId: uid }

    // Set server request status to {Sent}
    const acceptFriendRequest = createAcceptFriendRequest(userFriend.userId!, accept)
    dispatch(serverActions.sendRequest(acceptFriendRequest))

    dispatch(globalActions.showMasterLoading())

    // Call server API
    return friendService.updateFriendTie(
      { userId: userFriend.userId!, fullName: userFriend.fullName, avatar: userFriend.avatar, approved: false }, 
      { userId: user.userId!, fullName: user.fullName, avatar: user.avatar, approved: false }, 
      accept)
      .then(() => {
        dispatch(clearAll())
        dispatch(dbGetAllUsers())
        dispatch(dbGetFriendTies())
        dispatch(dbGetFriendRequests())

        // Send notification
        let description: string
        if (accept) {
          description = `${user.fullName} accepted to add you as friend.`
        } else {
          description = `${user.fullName} denied to add you as friend.`
        }
        dispatch(notifyActions.dbAddNotification(
          {
            description: description,
            url: `/${user.userId}`,
            notifyRecieverUserId: userFriend.userId as string,
            notifierUserId: uid,
            isSeen: false
          }))

        // Set server request status to {OK}
        acceptFriendRequest.status = ServerRequestStatusType.OK
        dispatch(serverActions.sendRequest(acceptFriendRequest))

        dispatch(globalActions.hideMasterLoading())

      }, (error: SocialError) => {
        dispatch(globalActions.showMessage(error.message))

        dispatch(globalActions.hideMasterLoading())

        // Set server request status to {Error}
        acceptFriendRequest.status = ServerRequestStatusType.Error
        dispatch(serverActions.sendRequest(acceptFriendRequest))
      })
  }
}

/**
 * Update user in circle/circles
 */
// export let dbUpdateUserInCircles = (circleIdList: List<string>, userFollowing: UserTie) => {
//   return (dispatch: any, getState: Function) => {
//     const state: Map<string, any>  = getState()
//     let uid: string = state.getIn(['authorize', 'uid'])
//     let user: User = { ...state.getIn(['user', 'info', uid]), userId: uid }

//     // Set server request status to {Sent}
//     const addToCircleRequest = createAddToCircleRequest(userFollowing.userId!)
//     dispatch(serverActions.sendRequest(addToCircleRequest))

//     dispatch(globalActions.showMasterLoading())

//     // Call server API
//     return userTieService.updateUsersTie(
//       { userId: user.userId!, fullName: user.fullName, avatar: user.avatar, approved: false },
//       { userId: userFollowing.userId!, fullName: userFollowing.fullName, avatar: userFollowing.avatar, approved: false },
//       circleIdList.toJS()
//     )
//       .then(() => {
//         let userTie: Map<string, any> = Map(new UserTie(
//           userFollowing.userId!,
//           moment().unix(),
//           userFollowing.fullName,
//           userFollowing.avatar,
//           false
//       ))
//       userTie = userTie.set('circleIdList', circleIdList)
//         dispatch(addFollowingUser(userTie))

//         // Set server request status to {OK}
//         addToCircleRequest.status = ServerRequestStatusType.OK
//         dispatch(serverActions.sendRequest(addToCircleRequest))

//         dispatch(globalActions.hideMasterLoading())

//         // Close select circle box
//         dispatch(closeSelectCircleBox(userFollowing.userId!))

//       }, (error: SocialError) => {
//         dispatch(globalActions.showMessage(error.message))

//         dispatch(globalActions.hideMasterLoading())

//         // Set server request status to {Error}
//         addToCircleRequest.status = ServerRequestStatusType.Error
//         dispatch(serverActions.sendRequest(addToCircleRequest))
//       })
//   }
// }

/**
 * Delete following user
 */
// export let dbDeleteFollowingUser = (userFollowingId: string) => {
//   return (dispatch: any, getState: Function) => {

//     const state: Map<string, any>  = getState()
//     let uid: string = state.getIn(['authorize', 'uid'])

//     // Set server request status to {Sent}
//     const deleteFollowingUserRequest = createdeleteFollowingUserRequest(userFollowingId)
//     dispatch(serverActions.sendRequest(deleteFollowingUserRequest))

//     dispatch(globalActions.showMasterLoading())

//     // Call server API
//     return userTieService.removeUsersTie(uid, userFollowingId)
//       .then(() => {
//         dispatch(deleteFollowingUser(userFollowingId))

//         dispatch(globalActions.hideMasterLoading())

//         // Close select circle box
//         dispatch(closeSelectCircleBox(userFollowingId))

//         // Set server request status to {OK}
//         deleteFollowingUserRequest.status = ServerRequestStatusType.OK
//         dispatch(serverActions.sendRequest(deleteFollowingUserRequest))
//       }, (error: SocialError) => {
//         dispatch(globalActions.showMessage(error.message))

//         dispatch(globalActions.hideMasterLoading())

//         // Close select circle box
//         dispatch(closeSelectCircleBox(userFollowingId))

//         // Set server request status to {Error}
//         deleteFollowingUserRequest.status = ServerRequestStatusType.Error
//         dispatch(serverActions.sendRequest(deleteFollowingUserRequest))
//       })
//   }
// }

/**
 * Update a circle from database
 */
// export const dbUpdateCircle = (newCircle: Circle) => {
//   return (dispatch: any, getState: Function) => {
//     // Get current user id
//     const state: Map<string, any>  = getState()
//     let uid: string = state.getIn(['authorize', 'uid'])

//     // Write the new data simultaneously in the list
//     let circle: Map<string, any> = state.getIn(['circle', 'circleList', newCircle.id!])
//     circle = circle.set('name', newCircle.name)
//     return circleService.updateCircle(uid, newCircle.id!, circle.toJS() as any)
//       .then(() => {
//         circle = circle.set('id', newCircle.id)
//         dispatch(updateCircle(circle))
//       }, (error: SocialError) => {
//         dispatch(globalActions.showMessage(error.message))
//       })
//   }

// }

/**
 * Delete a circle from database
 */
// export const dbDeleteCircle = (circleId: string) => {
//   return (dispatch: any, getState: Function) => {

//     // Get current user id
//     const state: Map<string, any>  = getState()
//     let uid: string = state.getIn(['authorize', 'uid'])

//     return circleService.deleteCircle(uid, circleId)
//       .then(() => {
//         dispatch(deleteCircle(circleId))
//       }, (error: SocialError) => {
//         dispatch(globalActions.showMessage(error.message))
//       })
//   }

// }

/**
 *  Get all circles from data base belong to current user
 */
// export const dbGetCircles = () => {
//   return (dispatch: any, getState: Function) => {
//     const state: Map<string, any>  = getState()
//     let uid: string = state.getIn(['authorize', 'uid'])
//     if (uid) {

//       return circleService.getCircles(uid)
//         .then((circles: { [circleId: string]: Circle }) => {
//           dispatch(addCircles(fromJS(circles)))
//         })
//         .catch((error: SocialError) => {
//           dispatch(globalActions.showMessage(error.message))
//         })

//     }
//   }
// }

/**
 *  Get all users
 */
export const dbGetAllUsers = () => {
  return (dispatch: any, getState: Function) => {
    const state: Map<string, any>  = getState()
    let uid: string = state.getIn(['authorize', 'uid'])
    if (uid) {
      friendService.getAllUsers(uid).then((result) => {

        dispatch(addAllUsers(result))

      })
        .catch((error: SocialError) => {
          dispatch(globalActions.showMessage(error.message))
        })
    }
  }
}

/**
 *  Get all user friend ties from data base
 */
export const dbGetFriendTies = () => {
  return (dispatch: any, getState: Function) => {
    const state: Map<string, any>  = getState()
    let uid: string = state.getIn(['authorize', 'uid'])
    if (uid) {
      friendService.getFriendTies(uid).then((result) => {

        dispatch(addFriendTies(fromJS(result)))

      })
        .catch((error: SocialError) => {
          dispatch(globalActions.showMessage(error.message))
        })
    }
  }
}

/**
 *  Get all user friend requests from data base
 */
export const dbGetFriendRequests = () => {
  return (dispatch: any, getState: Function) => {
    const state: Map<string, any>  = getState()
    let uid: string = state.getIn(['authorize', 'uid'])
    if (uid) {
      friendService.getFriendRequests(uid).then((result) => {

        dispatch(addFriendRequests(fromJS(result)))

      })
        .catch((error: SocialError) => {
          dispatch(globalActions.showMessage(error.message))
        })
    }
  }
}

export const bindFriendEvent = () => {
  return (dispatch: any, getState: Function) => {
    let friendRef = db.collection(`graphs:friends`)
    friendRef.onSnapshot((snapshot) => {
      // dispatch(clearAll())
      dispatch(dbGetAllUsers())
      dispatch(dbGetFriendTies())
      dispatch(dbGetFriendRequests())
    })
  }
}

/**
 *  Get all followers
 */
// export const dbGetFollowers = () => {
//   return (dispatch: any, getState: Function) => {
//     const state: Map<string, any>  = getState()
//     let uid: string = state.getIn(['authorize', 'uid'])
//     if (uid) {
//       userTieService.getUserTieSender(uid).then((result) => {

//         dispatch(userActions.addPeopleInfo(result as any))
//         dispatch(addUserTieds(result))

//       })
//         .catch((error: SocialError) => {
//           dispatch(globalActions.showMessage(error.message))
//         })
//     }
//   }
// }

/**
 * Get all user circles from data base by user id
 * @param uid user identifier
 */
// export const dbGetCirclesByUserId = (uid: string) => {
//   return (dispatch: any, getState: Function) => {

//     if (uid) {
//       return circleService.getCircles(uid)
//         .then((circles: { [circleId: string]: Circle }) => {
//           dispatch(addCircles(circles))
//         })
//         .catch((error: SocialError) => {
//           dispatch(globalActions.showMessage(error.message))
//         })
//     }
//   }
// }

/**
 * Create accept friend serevr request model
 */
const createAcceptFriendRequest = (leftNode: string, accept: boolean) => {
  let requestId
  if (accept) {
    requestId = StringAPI.createServerRequestId(ServerRequestType.FriendAcceptRequest, leftNode)
    return new ServerRequestModel(
      ServerRequestType.FriendAcceptRequest,
      requestId,
      '',
      ServerRequestStatusType.Sent
      )
  } else {
    requestId = StringAPI.createServerRequestId(ServerRequestType.FriendDenyRequest, leftNode)
    return new ServerRequestModel(
      ServerRequestType.FriendDenyRequest,
      requestId,
      '',
      ServerRequestStatusType.Sent
      )
  }
}

/**
 * Create add referer user to circle serevr request model
 */
// const createAddToCircleRequest = (userFollowingId: string) => {
//   const requestId = StringAPI.createServerRequestId(ServerRequestType.CircleAddToCircle, userFollowingId)
//   return new ServerRequestModel(
//     ServerRequestType.CircleAddToCircle,
//     requestId,
//     '',
//     ServerRequestStatusType.Sent
//     )
// }

/**
 * Create delete referer user serevr request model
 */
// const createdeleteFollowingUserRequest = (userFollowingId: string) => {
//   const requestId = StringAPI.createServerRequestId(ServerRequestType.CircleDeleteFollowingUser, userFollowingId)
//   return new ServerRequestModel(
//     ServerRequestType.CircleDeleteFollowingUser,
//     requestId,
//     '',
//     ServerRequestStatusType.Sent
//     )
// }

/* _____________ CRUD State _____________ */

/**
 * Add a circle
 */
// export const addCircle = (circle: Map<string, any>) => {
//   return {
//     type: FriendActionType.ADD_CIRCLE,
//     payload: { circle }
//   }
// }

/**
 * Update a circle
 */
// export const updateCircle = (circle: Map<string, any>) => {
//   return {
//     type: FriendActionType.UPDATE_CIRCLE,
//     payload: { circle }
//   }
// }

/**
 * Delete a circle
 */
// export const deleteCircle = (circleId: string) => {
//   return {
//     type: FriendActionType.DELETE_CIRCLE,
//     payload: { circleId }
//   }
// }

/**
 * Add a list of circle
 */
// export const addCircles = (circleList: {[circleId: string]: Circle}) => {
//   return {
//     type: FriendActionType.ADD_LIST_CIRCLE,
//     payload: { circleList }
//   }
// }

/**
 * Clea all data in friend store
 */
export const clearAll = () => {
  return {
    type: FriendActionType.CLEAR_ALL
  }
}

/**
 * Open circle settings
 */
// export const openCircleSettings = (circleId: string) => {
//   return {
//     type: FriendActionType.OPEN_CIRCLE_SETTINGS,
//     payload: { circleId }
//   }

// }

/**
 * Close open circle settings
 */
// export const closeCircleSettings = (circleId: string) => {
//   return {
//     type: FriendActionType.CLOSE_CIRCLE_SETTINGS,
//     payload: { circleId }
//   }

// }

/**
 * Add following user
 */
// export const addFollowingUser = (userTie: Map<string, any>) => {
//   return {
//     type: FriendActionType.ADD_FOLLOWING_USER,
//     payload: { userTie }
//   }
// }

/**
 * Update the user tie
 */
// export const updateUserTie = (userTie: UserTie) => {
//   return {
//     type: FriendActionType.UPDATE_USER_TIE,
//     payload: { userTie }
//   }
// }

/**
 * Add friend ties
 */
export const addFriendTies = (friendTies: {[userId: string]: FriendTie }) => {
  return {
    type: FriendActionType.ADD_FRIEND_TIE_LIST,
    payload: { friendTies }
  }
}

/**
 * Add friend requests
 */
export const addFriendRequests = (friendRequests: {[userId: string]: FriendTie }) => {
  return {
    type: FriendActionType.ADD_FRIEND_REQUEST_LIST,
    payload: { friendRequests }
  }
}

/**
 * Add all users 
 */
export const addAllUsers = (users: {[userId: string]: Profile }) => {
  return {
    type: FriendActionType.ADD_ALL_USERS_LIST,
    payload: { users }
  }
}

/**
 * Add users who send tie request for current user
 */
// export const addUserTieds = (userTieds: {[userId: string]: UserTie }) => {
//   return {
//     type: FriendActionType.ADD_USER_TIED_LIST,
//     payload: { userTieds }
//   }
// }

/**
 * Delete the user from a circle
 */
// export const deleteUserFromCircle = (userId: string, circleId: string) => {
//   return {
//     type: FriendActionType.DELETE_USER_FROM_CIRCLE,
//     payload: { userId, circleId }
//   }
// }

/**
 * Delete following user
 */
// export const deleteFollowingUser = (userId: string) => {
//   return {
//     type: FriendActionType.DELETE_FOLLOWING_USER,
//     payload: { userId }
//   }
// }

/**
 * Show the box to select circle
 */
// export const showSelectCircleBox = (userId: string) => {
//   return {
//     type: FriendActionType.SHOW_SELECT_CIRCLE_BOX,
//     payload: { userId }
//   }

// }

/**
 * Hide the box to select circle
 */
// export const hideSelectCircleBox = (userId: string) => {
//   return {
//     type: FriendActionType.HIDE_SELECT_CIRCLE_BOX,
//     payload: { userId }
//   }

// }

/**
 * Show loading on following user
 */
// export const showFollowingUserLoading = (userId: string) => {
//   return {
//     type: FriendActionType.SHOW_FOLLOWING_USER_LOADING,
//     payload: { userId }
//   }

// }

/**
 * Set current user selected circles for referer user
 */
// export const setSelectedCircles = (userId: string, circleList: string[]) => {
//   return {
//     type: FriendActionType.SET_SELECTED_CIRCLES_USER_BOX_COMPONENT,
//     payload: { userId, circleList }
//   }

// }

/**
 * Remove current user selected circles for referer user
 */
// export const removeSelectedCircles = (userId: string) => {
//   return {
//     type: FriendActionType.REMOVE_SELECTED_CIRCLES_USER_BOX_COMPONENT,
//     payload: { userId }
//   }
// }

/**
 * Open select circle box
 */
// export const openSelectCircleBox = (userId: string) => {
//   return {
//     type: FriendActionType.OPEN_SELECT_CIRCLES_USER_BOX_COMPONENT,
//     payload: { userId}
//   }

// }

/**
 * Close select circle box
 */
// export const closeSelectCircleBox = (userId: string) => {
//   return {
//     type: FriendActionType.CLOSE_SELECT_CIRCLES_USER_BOX_COMPONENT,
//     payload: { userId}
//   }

// }

/**
 * Hide loading on following user
 */
// export const hideFollowingUserLoading = (userId: string) => {
//   return {
//     type: FriendActionType.HIDE_FOLLOWING_USER_LOADING,
//     payload: { userId }
//   }

// }
