import React from 'react';
import { ScrollView, Dimensions } from 'react-native';
import { SearchBar, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';

let deviceHeight = Dimensions.get('window').height;

class SelectableFriendList extends React.Component {
    state = {
        friends: null,
        filter: false,
        selectedFriends: null
    }
    filterFriends = (input) => {
        const friends = this.props.friends.filter(f => {
            return f.displayName.includes(input);
        })
        this.setState({
            friends,
            filter: true
        })
    }
    onSelectFriend = (uid) => {
        let friends = [];
        if(this.state.selectedFriends) {
            if(this.state.selectedFriends.includes(uid)) {
                friends = this.state.selectedFriends.filter(id => id !== uid)
            } else {
                friends = [...this.state.selectedFriends, uid]
            }
        } else {
            friends = [uid]
        }
        this.setState({
            selectedFriends: friends
        })
        this.props.onFriendsChange(friends)
    }
    render() {
        let friends = this.state.filter ? this.state.friends : this.props.friends;
        let friendList = friends.map((friend) => {
            let listIcon;
            if(this.props.tempEvent && this.props.tempEvent.friends && this.props.tempEvent.friends.includes(friend.uid)) {
                listIcon = {name:'md-checkmark',type:'ionicon',size:20,color:'green'}
            } else {
                listIcon = {name:'md-add',type:'ionicon',size:20}
            }
            return (
                <ListItem
                    containerStyle={{width: 300}}
                    rightIcon={listIcon}
                    onPress={() => this.onSelectFriend(friend.uid)}
                    leftAvatar={{ rounded:true, source: {uri:friend.photoURL} }}
                    key={friend.uid}
                    title={friend.displayName}
                    subtitle={friend.email}
                    bottomDivider
                />
            )
        })

        return (
            <ScrollView contentContainerStyle={{alignItems:'center'}} style={{maxHeight: deviceHeight*.40}}>
                <SearchBar
                    lightTheme
                    containerStyle={{width: 300,marginBottom: 10, backgroundColor: 'transparent', borderBottomColor: 'transparent', borderTopColor: 'transparent'}}
                    inputStyle={{color: '#222'}}
                    onChangeText={(e) => this.filterFriends(e)}
                    placeholder='Filter Friends...'
                />
                    {friendList}
            </ScrollView>
        )
    }
}

const mapStateToProps = (state) => ({
    friends: state.friends,
    tempEvent: state.tempEvent
})
export default connect(mapStateToProps)(SelectableFriendList);