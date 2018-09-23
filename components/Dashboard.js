import React from 'react';
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, Picker } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Login from './Login';
import { Avatar, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import Loading from './Loading';
import Events from './Events';
import firebase from 'react-native-firebase'
import EventForm from './EventForm';
import { Dropdown } from 'react-native-material-dropdown';

let activityTypes = [{value: 'All Activity'}, {value: 'Friends Activity'}, {value: 'My Activity'}];

class Dashboard extends React.Component {
  state = {
    showEventFormModal: false,
    activityType: 'All Activity'
  }
  static navigationOptions = {
    title: 'Dashboard',
  };

  setEventFormModalVisible = (visible) => {
    this.setState({
      showEventFormModal: visible
    })
  }

  render() {
    if(this.props.currentUser) {
      return (
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Hi, {this.props.currentUser.displayName}</Text>
            <View style={styles.subContainer}>
              <Button
                onPress={() => this.setEventFormModalVisible(true)}
                icon={{name:'md-add',type:'ionicon',size:25,color:'#FFFFFF'}}
                title='New Event'
                backgroundColor='#3578E5'
                textStyle={{color:'#F6F8FA', fontSize: 16}}
                buttonStyle={{borderColor: '#F6F8FA', borderWidth: 1, width: 150, borderRadius: 30}}
              />
              <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.showEventFormModal}>
                <View style={[styles.container, styles.center]}>
                    <EventForm currentUser={this.props.currentUser}/>
                    <View style={styles.bottomCenter}>
                        <TouchableOpacity
                            onPress={() => this.setEventFormModalVisible(false)}>
                            <IonIcon name='md-close-circle-outline' size={35} color='#444'/>
                        </TouchableOpacity>
                        <Text style={styles.text}>Cancel</Text>
                    </View>
                </View>
            </Modal>
            </View>
            <View style={styles.container}>
              <Dropdown
                data={activityTypes}
                value={this.state.activityType}
                containerStyle={{minWidth: 200, marginBottom: 20}}
                onChangeText={val => this.setState({activityType: val})}
              />
              <Events activityType={this.state.activityType}/>

            </View>
          </ScrollView>
      );
    } else {
      return (
        <Loading message='...'/>
      )
    }

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50
  },
  subContainer: {
    marginTop: 30
  },
  title: {
    fontSize: 25,
    fontFamily: 'System' //Avenir Next, Optima
  },
  header: {
    fontSize: 22,
    marginBottom: 10
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  background: {
    flex: 1,
    width: null,
    height: null,
  },
  bottomCenter: {
    position: 'absolute',
    bottom: '8%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

const mapStateToProps = (state, props) => ({
  currentUser: state.currentUser,
  loggedIn: state.loggedIn
})

export default connect(mapStateToProps)(Dashboard);
