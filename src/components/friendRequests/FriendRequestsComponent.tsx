// - Import react components
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getTranslate, getActiveLanguage } from 'react-localize-redux'
import {Map} from 'immutable'

// - Import app components
import FriendBoxList from 'components/friendBoxList'

import { IFriendRequestsComponentProps } from './IFriendRequestsComponentProps'
import { IFriendRequestsComponentState } from './IFriendRequestsComponentState'
import { Circle } from 'core/domain/circles'

// - Import API

// - Import actions

/**
 * Create component class
 */
export class FriendRequestsComponent extends Component<IFriendRequestsComponentProps,IFriendRequestsComponentState> {

  static propTypes = {

  }

  /**
   * Component constructor
   * @param  {object} props is an object properties of component
   */
  constructor (props: IFriendRequestsComponentProps) {
    super(props)

    // Defaul state
    this.state = {

    }

    // Binding functions to `this`

  }

  /**
   * Reneder component DOM
   * @return {react element} return the DOM which rendered by component
   */
  render () {
    const {translate} = this.props
    const friendRequests = this.props.friendRequests!
    return (
          <div>
            {(friendRequests && friendRequests.keySeq().count() !== 0) ? (<div>
              <div className='profile__title'>
                {translate!('friends.friendRequestsLabel')}
                        </div>
                        <FriendBoxList users={friendRequests} showButton={true} />
              <div style={{ height: '24px' }}></div>
              </div>)
              : (<div className='g__title-center'>
                 {translate!('friends.noFriendRequestsLabel')}
               </div>)}
          </div>
    )
  }
}

  /**
   * Map dispatch to props
   * @param  {func} dispatch is the function to dispatch action to reducers
   * @param  {object} ownProps is the props belong to component
   * @return {object}          props of component
   */
const mapDispatchToProps = (dispatch: any,ownProps: IFriendRequestsComponentProps) => {
  return{

  }
}

  /**
   * Map state to props
   * @param  {object} state is the obeject from redux store
   * @param  {object} ownProps is the props belong to component
   * @return {object}          props of component
   */
const mapStateToProps = (state: Map<string, any>,ownProps: IFriendRequestsComponentProps) => {

  const uid = state.getIn(['authorize', 'uid'], 0)
  const friendRequests = state.getIn(['friend', 'friendRequests'], {})
  return{
    translate: getTranslate(state.get('locale')),
    friendRequests
  }
}

  // - Connect component to redux store
export default connect(mapStateToProps,mapDispatchToProps)(FriendRequestsComponent as any)
