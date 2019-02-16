import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Picker, StatusBar } from 'react-native';
import { Avatar, Button, Badge, Header, ListItem, Icon } from 'react-native-elements';
import { logoutRequest } from '../actions/Auth';
import { Cancel } from './navButtons';
import { connect } from 'react-redux';
import Loading from './Loading';
import styles from './styles/main';
import { updateUserStatus, updateFriendRequestsReceived } from '../actions/User';
import { createFriends, getFriends, cancelFriendRequest } from '../actions/User';
let userStatusTypes = [{value: 'Looking to hoop'}, {value: 'Available'}, {value: 'Unavailable'}];

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showStatusPicker: false
    }
  }
    setModalVisible = (visible) => {
      this.setState({
        showModal: visible
      })
    }
    denyFriendRequest = (prospectiveFriendId) => {

      // Cancel the request
      this.props.dispatch(cancelFriendRequest(this.props.currentUser.uid, prospectiveFriendId))

      // Hide modal
      this.setModalVisible(false);

      // update state to remove friend request where uid === prospectiveFriendId
      let updatedRequests = this.props.currentUser.friendRequestsReceived.filter(request => {
        return request.uid !== prospectiveFriendId
      })

      this.props.dispatch(updateFriendRequestsReceived(updatedRequests))
    }
    acceptFriendRequest = (prospectiveFriendId) => {

      // Accept the request and create friends
      this.props.dispatch(createFriends(this.props.currentUser.uid, prospectiveFriendId))

      // Hide modal
      this.setModalVisible(false);

      // Remove friend request where uid === prospectiveFriendId
      let updatedRequests = this.props.currentUser.friendRequestsReceived.filter(request => {
        return request.uid !== prospectiveFriendId
      })

      // Update state
      this.props.dispatch(updateFriendRequestsReceived(updatedRequests))

      // Update friends list
      let updatedFriendIds;
      if(this.props.currentUser.friends) {
        updatedFriendIds = [...this.props.currentUser.friends, prospectiveFriendId];
      } else {
        updatedFriendIds = [prospectiveFriendId]
      }

      this.props.dispatch(getFriends(updatedFriendIds));
    }
    updateStatusPicker = (visible) => {
      this.setState({showStatusPicker: visible})
    }
    logout = () => {
      this.props.dispatch(logoutRequest())
    }
    render() {
      let pendingFriends = <Text style={{alignSelf: 'center',marginTop: 30}}>No pending friend requests</Text>
      let friendsBadge;
      if(this.props.currentUser) {
        // STATUS PICKER
        let userStatusPicker;
        if(this.state.showStatusPicker) {
          userStatusPicker =
                <View style={[styles.fullScreen,{backgroundColor: '#3578E5'}]}>
                  <Text style={{alignSelf: 'center',fontSize: 18,color: '#fff',fontStyle: 'italic'}}>Set your status</Text>
                  <Picker
                    selectedValue={this.props.currentUser.status}
                    onValueChange={value => {
                      this.props.dispatch(updateUserStatus(value))
                      this.updateStatusPicker(false)
                    }}
                  >
                    {userStatusTypes.map(t => {
                      return (
                        <Picker.Item key={t.value} label={t.value} value={t.value} color='#fff'/>
                      )
                    })}
                  </Picker>
                </View>
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
          friendsBadge = <Badge value={this.props.currentUser.friendRequestsReceived.length} status="error" />

          pendingFriends = this.props.currentUser.friendRequestsReceived.map((pendingFriend) => {
            return (
              <ListItem
                disabled
                leftAvatar={{ rounded: true, source: {uri: pendingFriend.photoURL} }}
                rightElement={
                  <View style={{flexDirection: 'row',justifyContent: 'space-evenly'}}>
                    <Icon name='ios-close'
                      type='ionicon'
                      size={35}
                      color='red'
                      iconStyle={{marginRight: 15}}
                      onPress={()=> this.denyFriendRequest(pendingFriend.uid)}
                    />
                    <Icon name='ios-checkmark'
                      type='ionicon'
                      size={35}
                      color='green'
                      iconStyle={{marginLeft: 15}}
                      onPress={()=> this.acceptFriendRequest(pendingFriend.uid)}
                    />
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
              {userStatusPicker}
              <Button
                onPress={() => this.logout()}
                title=''
                icon={{name: 'ios-log-out',type: 'ionicon',size: 30,color: 'red'}}
                buttonStyle={{backgroundColor: 'transparent',alignSelf: 'flex-end',marginRight: 5,marginTop: 10}}
              />
              <View style={{alignItems: 'center',paddingBottom: 20}}>
                <Avatar
                  size='large'
                  rounded
                  source={{uri: this.props.currentUser.photoURL,rounded: true}}
                  activeOpacity={0.7}
                />
                <Text style={styles.accountText}>{this.props.currentUser.displayName}</Text>
                <TouchableOpacity
                  style={styles.centeredRow}
                  onPress={() => this.updateStatusPicker(true)}
                >
                  <Text style={[styles.whiteText]}>{this.props.currentUser.status} </Text>
                  <Badge status={badgeStatus} />
                </TouchableOpacity>
              </View>
            </View>
            {// friend Button with notification Badge
            }
            <View style={styles.flexStartRow}>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() => {
                  // render modal showing outstanding friend requests with ability to accept/decline
                  this.setModalVisible(true)
                }}
              >
                <Button
                  title={this.props.currentUser.friendRequestsReceived ? `${this.props.currentUser.friendRequestsReceived.length} new Friend Request(s)`: 'No new Friend Requests'}
                  titleStyle={{fontSize: 16}}
                  icon={{name: 'ios-people',type: 'ionicon',size: 25,color: '#333'}}
                  buttonStyle={{backgroundColor: 'transparent'}}
                  disabled
                  disabledStyle={{backgroundColor: 'transparent'}}
                  disabledTitleStyle={{color: '#333'}}
                />
                {friendsBadge}
              </TouchableOpacity>
            </View>
            <Modal
              transparent={false}
              visible={this.state.showModal}>
              <View style={styles.modalBackground}>
                <View style={[styles.modalContent]}>
                  <Header
                    centerComponent={{ text: 'Friend Requests', style: { color: '#FFFFFF', fontSize: 20 } }}
                    containerStyle={styles.headerContainer}
                  />
                  {pendingFriends}
                </View>
                <Cancel onCancel={() => this.setModalVisible(false)} />
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