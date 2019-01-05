import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import { logout, logoutRequest } from '../actions/Auth';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase'
import Loading from './Loading';
import Friends from './Friends/Friends';
import styles from './styles/main';

class Account extends React.Component {

    logout = () => {
        this.props.dispatch(logoutRequest())
    }
    render() {
        if(this.props.currentUser) {
            let courtCount = this.props.currentUser.saved_courts ? this.props.currentUser.saved_courts.length : 0;
            return (
                <ScrollView contentContainerStyle={[styles.container,{marginTop:50}]}>
                    <Button
                        onPress={() => this.logout()}
                        title=''
                        icon={{name:'md-log-out',type:'ionicon',size:25,color:'red'}}
                        buttonStyle={{backgroundColor:'transparent',alignSelf:'flex-end',marginRight:10}}
                    />
                    <View style={{alignItems:'center',marginBottom:20}}>
                        <Avatar
                            size='large'
                            rounded
                            source={{uri: this.props.currentUser.photoURL,rounded:true}}
                            activeOpacity={0.7}
                        />
                        <Text style={styles.text}>{this.props.currentUser.displayName}</Text>
                    </View>
                    {
                    <View style={styles.evenSpacedRow}>
                        <Button
                            title={this.props.currentUser.friends ? `${this.props.currentUser.friends.length}` : 0}
                            icon={{name:'md-people',type:'ionicon',size:23,color:'#FFFFFF'}}
                            buttonStyle={{backgroundColor:'transparent'}}
                        />
                        <Button
                            title={`${courtCount}`}
                            icon={{name:'md-pin',type:'ionicon',size:23,color:'#FFFFFF'}}
                            buttonStyle={{backgroundColor:'transparent'}}
                        />
                    </View>
                    }

                </ScrollView>
            )
        } else {
            return <Loading message='' indicator={true}/>
        }

    }
}

const mapStateToProps = (state, props) => ({
    currentUser: state.currentUser
})
export default connect(mapStateToProps)(Account);