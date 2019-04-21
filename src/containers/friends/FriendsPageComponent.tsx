// - Import react components
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { grey, cyan } from '@material-ui/core/colors'
import { push } from 'connected-react-router'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import SvgCamera from '@material-ui/icons/PhotoCamera'
import { getTranslate, getActiveLanguage } from 'react-localize-redux'
import {Map} from 'immutable'

// - Import app components
import Friends from 'src/components/friends'
import FriendRequests from 'src/components/friendRequests'
import YourCircles from 'src/components/yourCircles'
import FriendAddComponent from 'src/components/friendAdd'
import UserAvatarComponent from 'src/components/userAvatar'

// - Import API

// - Import actions
import * as circleActions from 'src/store/actions/circleActions'
import * as globalActions from 'src/store/actions/globalActions'
import * as friendActions from 'store/actions/friendActions'
import { IFriendsPageComponentProps } from './IFriendsPageComponentProps'
import { IFriendsPageComponentState } from './IFriendsPageComponentState'

/**
 * Create component class
 */
export class FriendsComponent extends Component<IFriendsPageComponentProps,IFriendsPageComponentState> {

  static propTypes = {

  }

  styles = {
    friendAddPrimaryText: {
      color: grey[400],
      cursor: 'text'
    },
    friendAddItem: {
      fontWeight: '200'
    }
  }

  /**
   * Component constructor
   * @param  {object} props is an object properties of component
   */
  constructor (props: IFriendsPageComponentProps) {
    super(props)
    // Defaul state
    this.state = {
      /**
       * If it's true, post write will be open
       */
      openFriendAdd: false,
    }

    // Binding functions to `this`
    this.handleOpenFriendAdd = this.handleOpenFriendAdd.bind(this)
    this.handleCloseFriendAdd = this.handleCloseFriendAdd.bind(this)
  }

  /**
   * Open friend add
   *
   *
   * @memberof StreamComponent
   */
  handleOpenFriendAdd = () => {
    this.setState({
      openFriendAdd: true
    })
  }
  /**
   * Close friend add
   *
   *
   * @memberof StreamComponent
   */
  handleCloseFriendAdd = () => {
    this.setState({
      openFriendAdd: false
    })
  }

  componentWillMount () {
    const {loadData} = this.props
    loadData()
  }

  /**
   * Reneder component DOM
   * @return {react element} return the DOM which rendered by component
   */
  render () {
  /**
   * Component styles
   */
    const styles = {
      people: {
        margin: '0 auto'
      },
      headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400
      },
      slide: {
        padding: 10
      }
    }

    const { friendRequestsLoaded, friendTiesLoaded, translate, uid} = this.props
    return (
      <div style={styles.people}>
        <FriendAddComponent open={this.state.openFriendAdd} onRequestClose={this.handleCloseFriendAdd} uid={uid}>
          <Paper elevation={2}>

            <ListItem button
              style={this.styles.friendAddItem as any}
              onClick={this.handleOpenFriendAdd}
            >
              <UserAvatarComponent fullName={this.props.fullName!} fileName={this.props.avatar!} size={36} />
              <ListItemText inset primary={<span style={this.styles.friendAddPrimaryText as any}> {translate!('friends.friendAddButtonText')}</span>} />
              <ListItemIcon>
                <SvgCamera />
              </ListItemIcon>
            </ListItem>

          </Paper>
          <div style={{ height: '16px' }}></div>
        </FriendAddComponent>
      {friendRequestsLoaded ? <FriendRequests /> : ''}
      {friendTiesLoaded ? <Friends /> : ''}
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
const mapDispatchToProps = (dispatch: any, ownProps: IFriendsPageComponentProps) => {

  return {
    loadData: () => { 
      // dispatch(friendActions.clearAll())
      dispatch(friendActions.dbGetFriendTies()),
      dispatch(friendActions.dbGetFriendRequests())
    }
  }
}

/**
 * Map state to props
 * @param  {object} state is the obeject from redux store
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapStateToProps = (state: Map<string, any>, ownProps: IFriendsPageComponentProps) => {
  const uid = state.getIn(['authorize', 'uid'], 0)
  const user = state.getIn(['user', 'info', uid])
  return {
    uid,
    translate: getTranslate(state.get('locale')),
    friendRequestsLoaded: state.getIn(['friend', 'friendRequestsLoaded']),
    friendTiesLoaded: state.getIn(['friend', 'friendTiesLoaded']),
    avatar: user ? user.avatar : '',
    fullName: user ? user.fullName : '',
  }
}

// - Connect component to redux store
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FriendsComponent as any) as any)
