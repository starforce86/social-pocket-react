import { BaseDomain } from 'core/domain/common'

export class FriendTie extends BaseDomain {

  constructor (
  /**
   * User identifier
   *
   * @type {string}
   * @memberof UserTie
   */
  public userId?: string,

    /**
     * Circle creation date time
     *
     * @type {Date}
     * @memberof Circle
     */
  public creationDate?: number,

    /**
     * User full name
     *
     * @type {string}
     * @memberof UserTie
     */
  public fullName?: string,

    /**
     * Avatar URL address
     *
     * @type {string}
     * @memberof UserTie
     */
  public avatar?: string,

    /**
     * If following user approved {true} or not {false}
     *
     * @type {Boolean}
     * @memberof UserTie
     */
  public approved?: Boolean,

  /**
   * List of circles identifire which this user belong to
   */
  public circleIdList?: string[],
  
  /**
   * User Email
   *
   * @type {string}
   * @memberof UserTie
   */
  public email?: string
  ) {
    super()
  }

}
