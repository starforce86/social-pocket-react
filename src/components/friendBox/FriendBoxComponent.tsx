// - Import react components
import React, { Component } from 'react'
import moment from 'moment/moment'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { push } from 'connected-react-router'
import { getTranslate, getActiveLanguage } from 'react-localize-redux'
import classNames from 'classnames'
import {Map, List as ImuList} from 'immutable'

// - Material UI
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import RaisedButton from '@material-ui/core/Button'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import { withStyles } from '@material-ui/core/styles'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Divider from '@material-ui/core/Divider'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
import SvgAdd from '@material-ui/icons/Add'
import IconButton from '@material-ui/core/IconButton'
import { grey } from '@material-ui/core/colors'

// - Import app components
import UserAvatar from 'components/userAvatar'

// - Import API
import StringAPI from 'api/StringAPI'

// - Import actions
import * as friendActions from 'store/actions/friendActions'

import { IFriendBoxComponentProps } from './IFriendBoxComponentProps'
import { IFriendBoxComponentState } from './IFriendBoxComponentState'
import { User } from 'core/domain/users'
import { FriendTie, Circle } from 'core/domain/circles'
import { ServerRequestType } from 'constants/serverRequestType'
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType'
import { ServerRequestModel } from 'models/server'
import none from 'ramda/es/none'

const styles = (theme: any) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  paperWithButton: {
    height: 254,
    width: 243,
    margin: 10,
    textAlign: 'center',
    minWidth: 230,    
    maxWidth: '257px'
  },
  paper: {
    width: 243,
    margin: 10,
    textAlign: 'center',
    minWidth: 230,    
    maxWidth: '257px'
  },
  dialogContent: {
    paddingTop: '5px',
    padding: '0px 5px 5px 5px'
  },
  circleName: {
    fontSize: '1rem'
  },
  space: {
    height: 20
  },
  fullPageXs: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      height: '100%',
      margin: 0,
      overflowY: 'auto'
    }
  }
})

/**
 * Create component class
 */
export class FriendBoxComponent extends Component<IFriendBoxComponentProps, IFriendBoxComponentState> {
  /**
   * Fields
   */
  static propTypes = {
    /**
     * User identifier
     */
    userId: PropTypes.string,
    /**
     * User information
     */
    user: PropTypes.object

  }

  styles = {
    followButton: {
      position: 'absolute',
      bottom: '30px',
      left: 0,
      right: 0
    },
    dialog: {
      width: '',
      maxWidth: '280px',
      borderRadius: '4px'
    }
  }

  /**
   * Component constructor
   * @param  {object} props is an object properties of component
   */
  constructor (props: IFriendBoxComponentProps) {
    super(props)
    const { userId } = this.props
    // Default state
    this.state = {
    }
    // Binding functions to `this`

  }

  /**
   * Handle accept friend
   */
  onAcceptFriend = (event: any) => {
    // This prevents ghost click
    event.preventDefault()
    const { acceptFriend, userId, user, acceptRequest, denyRequest, avatar, fullName } = this.props

    if (acceptRequest && acceptRequest.status === ServerRequestStatusType.Sent) {
      return
    }
    if (denyRequest && denyRequest.status === ServerRequestStatusType.Sent) {
      return
    }
    acceptFriend!({ avatar, userId, fullName }, true)
  }

  /**
   * Handle deny friend
   */
  onDenyFriend = (event: any) => {
    // This prevents ghost click
    event.preventDefault()
    const { acceptFriend, userId, user, acceptRequest, denyRequest, avatar, fullName } = this.props

    if (acceptRequest && acceptRequest.status === ServerRequestStatusType.Sent) {
      return
    }
    if (denyRequest && denyRequest.status === ServerRequestStatusType.Sent) {
      return
    }
    acceptFriend!({ avatar, userId, fullName }, false)
  }

  /**
   * Reneder component DOM
   * @return {react element} return the DOM which rendered by component
   */
  render () {
    const { 
      acceptRequest, 
      userId, 
      denyRequest, 
      classes, 
      translate,
      showButton 
    } = this.props

    return (
      <Paper key={userId} elevation={1} className={showButton ? classNames('grid-cell', classes.paperWithButton) : classNames('grid-cell', classes.paper)}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          height: '100%',
          position: 'relative',
          paddingTop: 20

        }}>
          <div onClick={() => this.props.goTo!(`/${this.props.userId}`)} style={{ cursor: 'pointer' }}>
            <UserAvatar
              fullName={this.props.fullName!}
              fileName={this.props.avatar!}
              size={90}
            />
          </div>
          <div onClick={() => this.props.goTo!(`/${this.props.userId}`)} className='people__name' style={{ cursor: 'pointer' }}>
            <div>
              {this.props.fullName}
            </div>
          </div>
          {showButton ? (
            <div style={this.styles.followButton as any}>
            <Button
              color='primary'
              onClick={this.onAcceptFriend}
              disabled={
                (acceptRequest ? acceptRequest.status === ServerRequestStatusType.Sent : false) ||
                (denyRequest ? denyRequest.status === ServerRequestStatusType.Sent : false)
              }
            >
              {translate!('userBox.acceptButton')}
            </Button>
            <Button
              color='primary'
              onClick={this.onDenyFriend}
              disabled={
                (acceptRequest ? acceptRequest.status === ServerRequestStatusType.Sent : false) ||
                (denyRequest ? denyRequest.status === ServerRequestStatusType.Sent : false)
              }
            >
              {translate!('userBox.denyButton')}
            </Button>
          </div>
          ) : ''}
          
        </div>
      </Paper>
    )
  }
}

/**
 * Map dispatch to props
 * @param  {func} dispatch is the function to dispatch action to reducers
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapDispatchToProps = (dispatch: Function, ownProps: IFriendBoxComponentProps) => {
  return {
    acceptFriend: (userFriend: FriendTie, accept: boolean) => dispatch(friendActions.dbAcceptFriend(userFriend, accept)),
    goTo: (url: string) => dispatch(push(url))

  }
}

/**
 * Map state to props
 * @param  {object} state is the obeject from redux store
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapStateToProps = (state: Map<string, any>, ownProps: IFriendBoxComponentProps) => {

  const uid = state.getIn(['authorize', 'uid'])
  const request = state.getIn(['server', 'request'])

  const acceptRequestId = StringAPI.createServerRequestId(ServerRequestType.FriendAcceptRequest, ownProps.userId)
  const acceptRequest = state.getIn(['server', 'request', acceptRequestId])
  const denyRequestId = StringAPI.createServerRequestId(ServerRequestType.FriendDenyRequest, ownProps.userId)
  const denyRequest = state.getIn(['server', 'request', denyRequestId])

  const userBox = state.getIn(['friend', 'allUsers', ownProps.userId])
  
  return {
    translate: getTranslate(state.get('locale')),
    acceptRequest,
    denyRequest,
    avatar: userBox.avatar || '' ,
    fullName: userBox.fullName || ''
  }
}

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles as any)(FriendBoxComponent as any) as any)
