import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Picker } from 'react-native';
import { Avatar, Button, Badge, Header, ListItem, Icon } from 'react-native-elements';
import { logoutRequest } from '../actions/Auth';
import { Cancel } from './navButtons';
import { connect } from 'react-redux';
import Loading from './Loading';
import styles from './styles/main';
import { updateUserStatus } from '../actions/User';

let userStatusTypes = [{value: 'Looking to hoop'}, {value: 'Available'}, {value: 'Unavailable'}];

class Account extends React.Component {
    state = {
        showStatusPicker: false
    }
    updateStatusPicker = (visible) => {
        this.setState({showStatusPicker: visible})
    }
    logout = () => {
        this.props.dispatch(logoutRequest())
    }
    render() {
        let pendingFriends = <Text style={{alignSelf:'center',marginTop:30}}>No pending friend requests</Text>
        let friendsBadge;
        if(this.props.currentUser) {
            let userStatusPicker;
            if(this.state.showStatusPicker) {
                userStatusPicker = 
                <View style={styles.fullScreen}>
                    <Picker
                        selectedValue={this.props.currentUser.status}
                        onValueChange={value => {
                            this.props.dispatch(updateUserStatus(value))
                            this.updateStatusPicker(false)
                        }}
                    >
                        {userStatusTypes.map(t => {
                            return (
                                <Picker.Item key={t.value} label={t.value} value={t.value} />
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
                    badgeStatus = 'primary';
                    break;
                case 'Unavailable' :
                    badgeStatus = 'warning';
                    break;
                default :
                    badgeStatus = 'error'
            }
            let courtCount = this.props.currentUser.saved_courts ? this.props.currentUser.saved_courts.length : 0;

            if(this.props.friendRequests && this.props.friendRequests.length > 0) {
                friendsBadge = <Badge value={this.props.friendRequests.length} status="error" />

                pendingFriends = this.props.friendRequests.map((pendingFriend) => {
                    return (
                        <ListItem
                            //containerStyle={{width:}}
                            disabled
                            leftAvatar={{ rounded:true, source: {uri:pendingFriend.photoURL} }}
                            rightElement={
                                <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
                                    <Icon name='md-close'
                                        type='ionicon'
                                        size={35}
                                        color='red'
                                        iconStyle={{marginRight:15}}
                                        onPress={()=> this.props.denyFriendRequest(pendingFriend.uid)}
                                    />                                
                                    <Icon name='md-checkmark'
                                        type='ionicon'
                                        size={35}
                                        color='green'
                                        iconStyle={{marginLeft:15}}
                                        onPress={()=> this.props.acceptFriendRequest(pendingFriend.uid)}
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
                <ScrollView contentContainerStyle={[styles.container,{marginTop:50}]}>
                    {userStatusPicker}
                    <Button
                        onPress={() => this.logout()}
                        title=''
                        icon={{name:'md-log-out',type:'ionicon',size:25,color:'red'}}
                        buttonStyle={{backgroundColor:'transparent',alignSelf:'flex-end',marginRight:10}}
                    />
                    <View style={{alignItems:'center',paddingBottom:20}}>
                        <Avatar
                            size='large'
                            rounded
                            source={{uri: this.props.currentUser.photoURL,rounded:true}}
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
                    
                    {// friend Button with notification Badge
                    }
                    <View style={styles.evenSpacedRow}>
                        <TouchableOpacity
                            style={{flexDirection:'row'}}
                            onPress={() => {
                                // render modal showing outstanding friend requests with ability to accept/decline
                                this.props.setModalVisible(true)
                            }}
                        >                       
                            <Button
                                title={this.props.friends ? `${this.props.friends.length}` : '0'}
                                icon={{name:'md-people',type:'ionicon',size:23,color:'#FFFFFF'}}
                                buttonStyle={{backgroundColor:'transparent'}}
                                disabled
                                disabledStyle={{backgroundColor:'transparent'}}
                                disabledTitleStyle={{color:'#FFFFFF'}}
                            />
                            {friendsBadge}
                        </TouchableOpacity>
                        <Button
                            title={`${courtCount}`}
                            icon={{name:'md-pin',type:'ionicon',size:23,color:'#FFFFFF'}}
                            buttonStyle={{backgroundColor:'transparent'}}
                        />
                    </View>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.props.modalVisible}>
                        <View style={styles.modalBackground}>
                            <View style={[styles.modalContent]}>
                                <Header
                                    centerComponent={{ text: 'Friend Requests', style: { color: '#FFFFFF', fontSize:20 } }}
                                    containerStyle={styles.headerContainer}
                                />
                                {pendingFriends}       
                            </View>
                            <Cancel onCancel={() => this.props.setModalVisible(false)} />
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