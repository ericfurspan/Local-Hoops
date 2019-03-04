import React from 'react';
import { View, AlertIOS } from 'react-native';
import { SearchBar, ListItem, Header } from 'react-native-elements';
import firebase from 'react-native-firebase'
import { connect } from 'react-redux';
import styles from '../../styles/main';

class AddFriend extends React.Component {
    state = {
      users: [],
      search: ''
    }
    updateSearch = search => {
      this.setState({search})
      this.getNonFriends(search)
    }
    // gets users that are not already friends
    getNonFriends = (search) => {
      let results = [];
      firebase.firestore().collection('users')
        .get()
        .then(docs => {
          docs.forEach(doc => {
            if(doc.data().displayName.includes(search) && this.props.currentUser.uid !== doc.data().uid) {
              if(!this.props.currentUser.friends) {
                results.push(doc.data())
              } else {
                if(!this.props.currentUser.friends.includes(doc.data().uid)) {
                  results.push(doc.data())
                }
              }
            }
          })
          return results;
        })
        .then((users) => {this.setState({users})})
        .catch(error => {
          console.log('firestore error in AddFriend.js.js!!')
          console.log(error)
        })
    }
    confirmAdd = (friend) => {
      AlertIOS.alert(
        'Please Confirm',
        `Are you sure you want to add ${friend.displayName} as a friend?`,
        [
          {
            text: 'Cancel',
          },
          {
            text: 'OK',
            onPress: () => this.props.onAddFriend(this.props.currentUser.uid,friend.uid)
          },
        ]
      );
    }

    render() {
      return (
        <View style={styles.centeredContainer}>
          <Header
            centerComponent={{ text: 'Add Friend', style: { color: '#FFFFFF', fontSize: 24 } }}
            containerStyle={styles.headerContainer}
          />
          <SearchBar
            lightTheme
            containerStyle={{width: 300,marginBottom: 10, marginTop: 10, backgroundColor: 'transparent', borderBottomColor: 'transparent', borderTopColor: 'transparent'}}
            inputStyle={{color: '#333'}}
            onChangeText={this.updateSearch}
            placeholder='Search by Name'
            value={this.state.search}
          />
          {this.state.users.map((f) => (
            <ListItem
              containerStyle={{width: 300}}
              onPress={() => this.confirmAdd(f)}
              rightIcon={{name: 'ios-add',type: 'ionicon',size: 20}}
              leftAvatar={{source: {uri: f.photoURL}, rounded: true}}
              key={f.uid}
              bottomDivider
              title={f.displayName}
            />
          ))}
        </View>
      )
    }
}

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  friends: state.friends
})
export default connect(mapStateToProps)(AddFriend);
