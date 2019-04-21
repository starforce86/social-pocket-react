export interface IFriendsPageComponentProps {

  /**
   * Router match
   *
   * @type {*}
   * @memberof IFriendsPageComponentProps
   */
  match?: any

  /**
   * Friend requests loaded {true} or not {false}
   *
   * @type {boolean}
   * @memberof IFriendsPageComponentProps
   */
  friendRequestsLoaded?: boolean

  /**
   * Friend ties loaded {true} or not {false}
   *
   * @type {boolean}
   * @memberof IFriendsPageComponentProps
   */
  friendTiesLoaded?: boolean

  /**
   * Rediret to another route
   *
   * @memberof IFriendsPageComponentProps
   */
  goTo?: (url: string) => any

  /**
   * Set title of top bar
   *
   * @memberof IFriendsPageComponentProps
   */
  setHeaderTitle?: (title: string) => any

  /**
   * Translate to locale string
   */
  translate?: (state: any) => any

  /**
   * User full name
   *
   * @type {string}
   * @memberof IFriendsPageComponentProps
   */
  fullName?: string

  /**
   * User avatar URL
   *
   * @type {string}
   * @memberof IFriendsPageComponentProps
   */
  avatar?: string
  uid: string

  /**
   * Load users' profile
   *
   * @memberof IFriendPageComponentProps
   */
  loadData: () => any
}
