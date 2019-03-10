import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Picker, StatusBar } from 'react-native';
import { Avatar, Button, Badge, Header, ListItem } from 'react-native-elements';
import { logoutRequest } from '../../actions/Auth';
import CancelButton from './CancelButton';
import { connect } from 'react-redux';
import Loading from './Loading';
import styles from '../../styles/main';
import { updateUserStatus, updateFriendRequestsReceived, updateFriendRequestsSent } from '../../actions/User';
import { createFriends, cancelFriendRequest } from '../../actions/User';
let userStatusTypes = [{value: 'Looking to hoop'}, {value: 'Available'}, {value: 'Unavailable'}];

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: {
        type: null,
        visible: false
      },
      showStatusPicker: false
    }
  }
    setModalVisible = (type, visible) => {
      this.setState({
        showModal: {
          type,
          visible
        }
      })
    }
    denyFriendRequest = (type, prospectiveFriendId) => {

      // Hide modal
      this.setModalVisible(null, false);

      if(type === 'received') {
      // Cancel the request
        this.props.dispatch(cancelFriendRequest(this.props.currentUser.uid, prospectiveFriendId))
        // update state to remove friend request where uid === prospectiveFriendId
        let updatedRequests = this.props.currentUser.friendRequestsReceived.filter(request => {
          return request.uid !== prospectiveFriendId
        })

        this.props.dispatch(updateFriendRequestsReceived(updatedRequests))
      } else if(type === 'sent') {
        // Cancel the request
        this.props.dispatch(cancelFriendRequest(prospectiveFriendId, this.props.currentUser.uid))
        // update state to remove friend request where uid === prospectiveFriendId
        let updatedRequests = this.props.currentUser.friendRequestsSent.filter(request => {
          return request.uid !== prospectiveFriendId
        })

        this.props.dispatch(updateFriendRequestsSent(updatedRequests))
      }

    }
    acceptFriendRequest = (prospectiveFriendId) => {

      // Accept the request and create friends
      this.props.dispatch(createFriends(this.props.currentUser.uid, prospectiveFriendId))

      // Hide modal
      this.setModalVisible(null, false);
    }
    toggleStatusPicker = () => {
      this.setState((prevState) => ({
        showStatusPicker: !prevState.showStatusPicker
      }))
    }
    logout = () => {
      this.props.dispatch(logoutRequest())
    }

    render() {
      let friendRequestsReceived = <Text style={{alignSelf: 'center',marginTop: 30}}>None</Text>
      let friendRequestsSent = <Text style={{alignSelf: 'center',marginTop: 30}}>None</Text>
      let friendRequestsReceivedBadge;

      if(this.props.currentUser) {
        // STATUS PICKER
        let userStatusPicker;
        if(this.state.showStatusPicker) {
          userStatusPicker =
                  <Picker
                    selectedValue={this.props.currentUser.status}
                    onValueChange={value => {
                      this.props.dispatch(updateUserStatus(value))
                      this.toggleStatusPicker()
                    }}
                    style={{width: '50%'}}
                  >
                    {userStatusTypes.map(t => {
                      return (
                        <Picker.Item key={t.value} label={t.value} value={t.value} color='#333' />
                      )
                    })}
                  </Picker>
        }
        // determine badge status
        let badgeStatus;
        switch(this.props.currentUser.status) {
          case 'Looking to hoop' :
            badgeStatus = 'success';
            break;
          case 'Available' :
            badgeStatus = 'success';
            break;
          case 'Unavailable' :
            badgeStatus = 'warning';
            break;
          default :
            badgeStatus = 'error'
        }

        if(this.props.currentUser.friendRequestsReceived && this.props.currentUser.friendRequestsReceived.length > 0) {
          friendRequestsReceivedBadge = <Badge value={this.props.currentUser.friendRequestsReceived.length} status="error" />

          friendRequestsReceived = this.props.currentUser.friendRequestsReceived.map((pendingFriend) => {
            return (
              <ListItem
                disabled
                leftAvatar={{ rounded: true, source: {uri: pendingFriend.photoURL} }}
                rightElement={
                  <View style={{flexDirection: 'row',justifyContent: 'space-evenly'}}>
                    <TouchableOpacity
                      onPress={()=> this.acceptFriendRequest(pendingFriend.uid)}
                      style={{marginRight: 20}}
                    >
                      <Text style={{color: 'green',fontWeight: 'bold', fontSize: 16}}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={()=> this.denyFriendRequest('received', pendingFriend.uid)}
                    >
                      <Text style={{color: 'red',fontWeight: 'bold', fontSize: 16}}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                }
                key={pendingFriend.uid}
                title={pendingFriend.displayName}
                bottomDivider
              />
            )
          })
        }
        if(this.props.currentUser.friendRequestsSent && this.props.currentUser.friendRequestsSent.length > 0) {

          friendRequestsSent = this.props.currentUser.friendRequestsSent.map((pendingFriend) => {
            return (
              <ListItem
                disabled
                leftAvatar={{ rounded: true, source: {uri: pendingFriend.photoURL} }}
                rightElement={
                  <View style={{flexDirection: 'row',justifyContent: 'space-evenly'}}>
                    <TouchableOpacity
                      onPress={()=> this.denyFriendRequest('sent', pendingFriend.uid)}
                    >
                      <Text style={{color: 'red',fontWeight: '500', fontSize: 16}}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                }
                key={pendingFriend.uid}
                title={pendingFriend.displayName}
                bottomDivider
              />
            )
          })
        }
        return (
          <ScrollView contentContainerStyle={[styles.container]}>
            <StatusBar hidden />
            <View style={styles.accountTop}>
              <View style={{alignItems: 'center'}}>
                <Avatar
                  size='large'
                  rounded
                  source={{uri: this.props.currentUser.photoURL,rounded: true}}
                  activeOpacity={0.7}
                />
                <Text style={styles.accountText}>{this.props.currentUser.displayName}</Text>
                <TouchableOpacity
                  style={styles.centeredRow}
                  // onPress={() => this.updateStatusPicker(true)}
                >
                  <Text style={[styles.whiteText]}>{this.props.currentUser.status} </Text>
                  <Badge status={badgeStatus} />
                </TouchableOpacity>
              </View>
            </View>
            {// Friend Requests button with notification Badge
            }
            <View style={{marginBottom: 10,marginTop: 10}}>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() => {
                  // render modal showing outstanding friend requests with ability to accept/decline
                  this.setModalVisible('friendrequests', true)
                }}
              >
                <Button
                  title='Friend Requests'
                  titleStyle={{fontSize: 18,marginLeft: 5}}
                  icon={{name: 'ios-people',type: 'ionicon',size: 25,color: '#333'}}
                  buttonStyle={{backgroundColor: 'transparent'}}
                  disabled
                  disabledStyle={{backgroundColor: 'transparent'}}
                  disabledTitleStyle={{color: '#333'}}
                />
                {friendRequestsReceivedBadge}
              </TouchableOpacity>
            </View>

            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() => this.toggleStatusPicker()}
              >
                <Button
                  title='Set your Status'
                  titleStyle={{fontSize: 18,marginLeft: 5}}
                  icon={{name: 'ios-pulse',type: 'ionicon',size: 25,color: '#333'}}
                  buttonStyle={{backgroundColor: 'transparent'}}
                  disabled
                  disabledStyle={{backgroundColor: 'transparent'}}
                  disabledTitleStyle={{color: '#333'}}
                />
              </TouchableOpacity>

              {userStatusPicker}

            </View>

            <View style={{position: 'absolute',bottom: 0,alignSelf: 'center'}}>
              <Button
                onPress={() => this.logout()}
                title='Logout'
                titleStyle={{color: 'red'}}
                icon={{name: 'ios-log-out',type: 'ionicon',size: 30,color: 'red'}}
                buttonStyle={{backgroundColor: 'transparent'}}
                testID='Logout'
              />
            </View>

            <Modal
              transparent={false}
              visible={this.state.showModal.visible}>
              <View style={styles.modalBackground}>
                <View style={[styles.modalContent]}>
                  <Header
                    centerComponent={{ text: 'Friend Requests', style: { color: '#FFFFFF', fontSize: 20 } }}
                    containerStyle={styles.headerContainer}
                  />
                  <ScrollView>
                    <Text style={[styles.header,{marginTop: 20,marginBottom: 10}]}>Awaiting your approval</Text>
                    {friendRequestsReceived}
                    <Text style={[styles.header,{marginTop: 50}]}>Pending requests</Text>
                    {friendRequestsSent}
                  </ScrollView>
                </View>
                <CancelButton onCancel={() => this.setModalVisible(null, false)} />
              </View>
            </Modal>
          </ScrollView>
        )
      } else {
        return <Loading message='' indicator={true}/>
      }

    }
}

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  friends: state.friends
})
export default connect(mapStateToProps)(Account);