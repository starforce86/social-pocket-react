// - Import react components
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getTranslate, getActiveLanguage } from 'react-localize-redux'
import { Map, List as ImuList } from 'immutable'

import { Card, CardActions, CardHeader, CardMedia, CardContent } from '@material-ui/core'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Paper from '@material-ui/core/Paper'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
import Button from '@material-ui/core/Button'
import RaisedButton from '@material-ui/core/Button'
import { grey } from '@material-ui/core/colors'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import SvgRemoveImage from '@material-ui/icons/RemoveCircle'
import SvgCamera from '@material-ui/icons/PhotoCamera'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { withStyles } from '@material-ui/core/styles'
import Menu from '@material-ui/core/Menu'
import Grow from '@material-ui/core/Grow'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grid from '@material-ui/core/Grid/Grid'
import classNames from 'classnames'

// - Import app components
import config from 'src/config'
import ImageGallery from 'components/imageGallery'
import Img from 'components/img'
import UserAvatarComponent from 'components/userAvatar'
import { Post } from 'core/domain/posts'
import { Profile, User } from 'src/core/domain/users'
import { UserTie } from 'core/domain/circles'

// - Import API
import * as PostAPI from 'api/PostAPI'

// - Import actions
import * as friendActions from 'store/actions/friendActions'
import * as postActions from 'store/actions/postActions'
import * as globalActions from 'store/actions/globalActions'
import { IFriendAddComponentProps } from './IFriendAddComponentProps'
import { IFriendAddComponentState } from './IFriendAddComponentState'

const styles = (theme: any) => ({
  fullPageXs: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      height: '100%',
      margin: 0,
      overflowY: 'auto'
    }
  },
  backdrop: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: '-1',
    position: 'fixed',
    willChange: 'opacity',
    backgroundColor: 'rgba(251, 249, 249, 0.5)',
    WebkitTapHighlightColor: 'transparent'
  },
  content: {
    padding: 0,
    paddingTop: 0
  },
  dialogRoot: {
    paddingTop: 0
  },
  popperOpen: {
    zIndex: 10
  },
  popperClose: {
    pointerEvents: 'none',
    zIndex: 0
  },
  author: {
    paddingRight: 70
  }
})

// - Create PostWrite component class
export class FriendAddComponent extends Component<IFriendAddComponentProps, IFriendAddComponentState> {

  /**
   * Component constructor
   * @param  {object} props is an object properties of component
   */
  constructor(props: IFriendAddComponentProps) {

    super(props)

    // Default state
    this.state = {
      /**
       * Friend email
       */
      friendEmail: '',
      /**
       * If it's true add button will be disabled
       */
      disabledAdd: true,
      
    }

    // Binding functions to `this`
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
  }

  /**
   * Handle send post to the server
   * @param  {event} evt passed by clicking on the post button
   */
  handleAdd = () => {
    const { friendEmail } = this.state

    const {
      uid,
      ownerAvatar,
      ownerDisplayName,
      allUsers,
      allUsersLoaded,
      friendRequests,
      friendRequestsLoaded,
      friendTies,
      friendTiesLoaded,
      dispatch,
      onRequestClose,
      addFriend,
      } = this.props

    if (friendTies.count() + friendRequests.count() >= config.constants.maxFriends) {
      if (dispatch) {
        dispatch(globalActions.showMessage(`Your current friends and friend requests can\'t excceed ${config.constants.maxFriends}!`))
      }
      return
    }

    if (friendEmail.trim() === '') {
      this.setState({
        disabledAdd: false
      })
      return
    }

    if (!allUsersLoaded || !friendRequestsLoaded || !friendTiesLoaded) {
      return
    }
    let matchUsers: Map<string, Profile> = allUsers.filter((user: Profile, userId: string) => user.email === friendEmail.trim())
    if (!matchUsers || matchUsers.count() === 0) {
      if (dispatch) {
        dispatch(globalActions.showMessage('Not found the user with that email!'))
      }
      return
    }
    let matchUserId: string = matchUsers.keys().next().value
    let matchUser: Profile = matchUsers.values().next().value
    if (!matchUserId || !matchUser) {
      if (dispatch) {
        dispatch(globalActions.showMessage('Not found the userId with that email!'))
      }
      return
    }
    // check if self
    if (matchUserId === uid) {
      if (dispatch) {
        dispatch(globalActions.showMessage('Can\'t sent friend request to yourself!'))
      }
      return
    }
    // check if already be in friends
    if (friendTies.has(matchUserId)) {
      if (dispatch) {
        dispatch(globalActions.showMessage('That user is already your friend'))
      }
      return
    }
    // check if already sent friend request
    if (friendRequests.has(matchUserId)) {
      if (dispatch) {
        dispatch(globalActions.showMessage('You already sent friend request'))
      }
      return
    }

    addFriend!(uid, {
      userId: matchUserId,
      creationDate: Date.now(),
      fullName: matchUser.fullName,
      avatar: matchUser.avatar,
      approved: false
    }, onRequestClose)
  }

  /**
   * When the post text changed
   * @param  {event} evt is an event passed by change post text callback funciton
   * @param  {string} data is the post content which user writes
   */
  handleOnChange = (event: any) => {
    const data = event.target.value
    this.setState({ friendEmail: data })
    if (data.length === 0 || data.trim() === '') {
      this.setState({
        friendEmail: data,
        disabledAdd: true
      })
    } else {
      this.setState({
        friendEmail: data,
        disabledAdd: false
      })
    }

  }

  componentWillReceiveProps(nextProps: IFriendAddComponentProps) {
    if (!nextProps.open) {
      this.setState({
      /**
       * Post text
       */
      friendEmail: '',
      /**
       * If it's true post button will be disabled
       */
      disabledAdd: true,
      
      })
    }
  }

  /**
   * Reneder component DOM
   * @return {react element} return the DOM which rendered by component
   */
  render() {

    const { classes, translate } = this.props

    let postAvatar = <UserAvatarComponent fullName={this.props.ownerDisplayName!} fileName={this.props.ownerAvatar!} size={36} />

    let author = (
      <div className={classes.author}>
        <span style={{
          fontSize: '14px',
          paddingRight: '10px',
          fontWeight: 400,
          color: 'rgba(0,0,0,0.87)',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          lineHeight: '25px'
        }}>{this.props.ownerDisplayName}</span><span style={{
          fontWeight: 400,
          fontSize: '10px'
        }}></span>
      </div>
    )

    const styles = {
      dialog: {
        width: '',
        maxWidth: '530px',
        borderRadius: '4px'
      }
    }

    return (
      <div style={this.props.style}>
        {this.props.children}
        <Dialog
          BackdropProps={{ className: classes.backdrop } as any}
          PaperProps={{className: classes.fullPageXs}}
          key={this.props.id || 0}
          open={this.props.open}
          onClose={this.props.onRequestClose}
        >
          <DialogContent
            className={classes.content}
            style={{ paddingTop: 0 }}

          >

            <Card elevation={0}>
              <CardHeader
                title={author}
                avatar={postAvatar}
              >
              </CardHeader>
              <CardContent>
                <Grid item xs={12}>
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
                  <div style={{ position: 'relative', flexDirection: 'column', display: 'flex', flexGrow: 1, overflow: 'hidden', overflowY: 'auto', maxHeight: '300px' }}>
                    <TextField
                      autoFocus
                      value={this.state.friendEmail}
                      onChange={this.handleOnChange}
                      placeholder={translate!('friends.addFriendTextareaPlaceholder')}
                      style={{ fontWeight: 400, fontSize: '14px', margin: '0 16px', flexShrink: 0, width: 'initial', flexGrow: 1 }}

                    />

                  </div>
                </div>
                </Grid>
              </CardContent>
            </Card>
          </DialogContent>
          <DialogActions>
            <Button
              color='primary'
              disableFocusRipple={true}
              disableRipple={true}
              onClick={this.props.onRequestClose}
              style={{ color: grey[800] }}
            >
              {translate!('friends.cancelButton')}
            </Button>
            <Button
              color='primary'
              disableFocusRipple={true}
              disableRipple={true}
              onClick={this.handleAdd}
              disabled={this.state.disabledAdd}
            >
              {translate!('friends.addButton')}
            </Button>
          </DialogActions>
        </Dialog>

      </div >
    )
  }
}

/**
 * Map dispatch to props
 * @param  {func} dispatch is the function to dispatch action to reducers
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapDispatchToProps = (dispatch: any, ownProps: IFriendAddComponentProps) => {
  return {
    dispatch,
    post: (post: Post, callBack: Function) => dispatch(postActions.dbAddImagePost(post, callBack)),
    update: (post: Map<string, any>, callBack: Function) => dispatch(postActions.dbUpdatePost(post, callBack)),
    addFriend: (userId: string, userFriend: UserTie, callBack: Function) => dispatch(friendActions.dbAddFriend(userId, userFriend, callBack))
  }
}

/**
 * Map state to props
 * @param  {object} state is the obeject from redux store
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapStateToProps = (state: Map<string, any>, ownProps: IFriendAddComponentProps) => {
  const uid = state.getIn(['authorize', 'uid'])
  const user = state.getIn(['user', 'info', uid], {})
  const allUsers = state.getIn(['friend', 'allUsers'], {})
  const allUsersLoaded = state.getIn(['friend', 'allUsersLoaded'], {})
  const friendRequests = state.getIn(['friend', 'friendRequests'], {})
  const friendRequestsLoaded = state.getIn(['friend', 'friendRequestsLoaded'], {})
  const friendTies = state.getIn(['friend', 'friendTies'], {})
  const friendTiesLoaded = state.getIn(['friend', 'friendTiesLoaded'], {})
  return {
    translate: getTranslate(state.get('locale')),
    uid,
    ownerAvatar: user.avatar || '',
    ownerDisplayName: user.fullName || '',
    allUsers,
    allUsersLoaded,
    friendRequests,
    friendRequestsLoaded,
    friendTies,
    friendTiesLoaded
  }
}

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles as any)(FriendAddComponent as any) as any)
