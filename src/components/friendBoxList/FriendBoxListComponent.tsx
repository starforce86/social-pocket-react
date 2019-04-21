// - Import react components
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {Map} from 'immutable'

// - Import app components
import FriendBox from 'components/friendBox'

import { IFriendBoxListComponentProps } from './IFriendBoxListComponentProps'
import { IFriendBoxListComponentState } from './IFriendBoxListComponentState'
import { FriendTie } from 'core/domain/circles/friendTie'

// - Import API

// - Import actions

/**
 * Create component class
 */
export class FriendBoxListComponent extends Component<IFriendBoxListComponentProps,IFriendBoxListComponentState> {

  static propTypes = {
        /**
         * List of users
         */
    users: PropTypes.object
  }

    /**
     * Component constructor
     * @param  {object} props is an object properties of component
     */
  constructor (props: IFriendBoxListComponentProps) {
    super(props)

        // Defaul state
    this.state = {

    }

        // Binding functions to `this`

  }

  userList = () => {
    let { uid, showButton } = this.props
    const users = this.props.users
    const FriendBoxList: any[] = []
    if (users) {
       users.forEach((user: FriendTie, key: string) => {
        if (uid !== key) {
          FriendBoxList.push(<FriendBox key={key} userId={key} user={user} showButton={showButton}/>)
        }
      })
    }
    return FriendBoxList
  }

    /**
     * Reneder component DOM
     * @return {react element} return the DOM which rendered by component
     */
  render () {

    const styles = {

    }

    return (

                <div className='grid grid__1of4 grid__space-around'>
                  {this.userList()}
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
const mapDispatchToProps = (dispatch: Function, ownProps: IFriendBoxListComponentProps) => {
  return {

  }
}

/**
 * Map state to props
 * @param  {object} state is the obeject from redux store
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapStateToProps = (state: any, ownProps: IFriendBoxListComponentProps) => {
  const uid = state.getIn(['authorize', 'uid'], 0)
  return {
    uid
  }
}

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(FriendBoxListComponent as any)
