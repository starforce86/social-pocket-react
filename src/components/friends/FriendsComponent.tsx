// - Import react components
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getTranslate, getActiveLanguage } from 'react-localize-redux'
import {Map} from 'immutable'

// - Import app components
import FriendBoxList from 'components/friendBoxList'

import { IFriendsComponentProps } from './IFriendsComponentProps'
import { IFriendsComponentState } from './IFriendsComponentState'

// - Import API

// - Import actions

/**
 * Create component class
 */
export class FriendsComponent extends Component<IFriendsComponentProps,IFriendsComponentState> {

  static propTypes = {

  }

  /**
   * Component constructor
   * @param  {object} props is an object properties of component
   */
  constructor (props: IFriendsComponentProps) {
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
    const friends = this.props.friends!
    return (
          <div>
            {(friends && friends.count() !== 0) ? (<div>
              <div className='profile__title'>
                {translate!('friends.friendsLabel')}
                        </div>
                        <FriendBoxList users={friends} showButton={false} />
              <div style={{ height: '24px' }}></div>
              </div>)
              : (<div className='g__title-center'>
                 {translate!('friends.noFriendsLabel')}
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
const mapDispatchToProps = (dispatch: any,ownProps: IFriendsComponentProps) => {
  return{

  }
}

  /**
   * Map state to props
   * @param  {object} state is the obeject from redux store
   * @param  {object} ownProps is the props belong to component
   * @return {object}          props of component
   */
const mapStateToProps = (state: Map<string, any>,ownProps: IFriendsComponentProps) => {

  const uid = state.getIn(['authorize', 'uid'], 0)
  const friends = state.getIn(['friend', 'friendTies'], {})
  return{
    translate: getTranslate(state.get('locale')),
    friends
  }
}

  // - Connect component to redux store
export default connect(mapStateToProps,mapDispatchToProps)(FriendsComponent as any)
