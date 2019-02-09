import React from 'react';
import { View, Modal, Dimensions } from 'react-native';
import { Button, Header, ButtonGroup, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import Loading from './Loading';
import Events from './Event/Events';
import EventForm from './Event/CreateEvent/EventForm';
import { Dropdown } from 'react-native-material-dropdown';
import { getFriends,  } from '../actions/User';
import { updateLocation, locationError, toggleLocation } from '../actions/Location';
import ErrorMessage from './ErrorMessage';
import { Cancel } from './navButtons';
import styles from './styles/main';
import FCM from './FCM';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight= Dimensions.get('window').height;

let activityTypes = [{value: 'All'}, {value: 'Friends'}, {value: 'Only Me'}];

class Dashboard extends React.Component {
  state = {
    showEventFormModal: false,
    activityType: 'All',
    selectedIndex: 0,
  }

  componentDidMount() {
    if(!this.props.loggedIn) {
      this.props.navigation.navigate('Auth');
    }

    this.getUserLocation();

    if(this.props.currentUser && this.props.currentUser.friends && this.props.currentUser.friends.length > 0) {
      this.props.dispatch(getFriends(this.props.currentUser.friends));
    } 
  }
  setEventFormModalVisible = (visible) => {
    this.setState({
      showEventFormModal: visible
    })
  }
  updateSelectedIndex = (selectedIndex) => {
    this.setState({selectedIndex})
  }
  // Finds user location
  getUserLocation = () => {

    navigator.geolocation.getCurrentPosition(position => {
      this.props.dispatch(updateLocation(position.coords));
      this.props.dispatch(toggleLocation(true));
    }, err => {
      this.props.dispatch(locationError(err.message));
      this.props.dispatch(toggleLocation(false));
    }),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000};

  }

  render() {
    if(this.props.error) {
      return <ErrorMessage message={this.props.error}/>
    }

    const eventViewBtns = ['Timeline', 'List'];

    if(this.props.currentUser) { 

      return (
        <View style={styles.container}>
          <Header
              centerComponent={{ text: 'Local Hoops', style: { color: '#FFFFFF', fontSize:24, fontFamily: 'ArchitectsDaughter-Regular' } }} //ArchitectsDaughter-Regular
              containerStyle={{
                  backgroundColor: '#3578E5',
                  justifyContent: 'space-around',
                  height:deviceHeight*.12
              }}
          />
            <FCM />
          

          <View style={styles.centeredContainer}>

            {/* CHANGE LOCATION   
            <View style={{width:deviceWidth,flexDirection:'row',justifyContent:'space-between'}}>
                <Text style={styles.header}>City, State</Text>
                <Button
                  //onPress={() => this.setEventFormModalVisible(true)}
                  icon={{name:'md-paper-plane',type:'ionicon',size:16,color:'#3578E5'}}
                  title='Change my location'
                  titleStyle={{color:'#3578E5',fontSize:14,fontWeight:'500'}}
                  buttonStyle={{backgroundColor:'transparent'}}
                />
            </View>
            */}

            {// RECENT ACTIVITY
            }
            <View style={{width:deviceWidth,flexDirection:'row',justifyContent:'space-between',marginTop:15}}>
                <Text style={styles.header}>Recent Activity</Text>
                <Button
                  onPress={() => this.setEventFormModalVisible(true)}
                  icon={{name:'md-add',type:'ionicon',size:16,color:'#3578E5'}}
                  title='New Event'
                  type='outline'
                  raised
                  containerStyle={{marginRight:10}}
                  titleStyle={{color:'#3578E5',fontSize:14,fontWeight:'500'}}
                />
            </View>

            {/* SAVED COURTS
            <View style={{width:deviceWidth,flexDirection:'row',justifyContent:'space-between'}}>
                <Text style={styles.header}>Saved Courts</Text>
            </View>
            <Divider style={styles.divider}/>
            */}

            {// NEW EVENT MODAL
            }
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.showEventFormModal}>
              <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                    <EventForm onClose={() => this.setEventFormModalVisible(false)} currentUser={this.props.currentUser}/>
                </View>
                <Cancel onCancel={() => this.setEventFormModalVisible(false)} title="Cancel"/>
              </View>
            </Modal>

            {// ACTIVITY TYPE
            }
            <View style={{alignSelf:'flex-start',marginLeft:25}}>
              <Dropdown
                data={activityTypes}
                value={this.state.activityType}
                containerStyle={{width: 100,backgroundColor:'transparent'}}
                itemColor='#333'
                onChangeText={val => this.setState({activityType: val})}
              />
            </View>

            {// TIMELINE / LIST OPTION
            }              
            <View style={{alignSelf:'center',width:200,marginBottom:10}}>
              <ButtonGroup
                onPress={this.updateSelectedIndex}
                selectedIndex={this.state.selectedIndex}
                buttons={eventViewBtns}
                buttonStyle={{backgroundColor:'#FAFAFA'}}
                selectedButtonStyle={{backgroundColor:'#FFFFFF'}}
                textStyle={{color:'#777'}}
                selectedTextStyle={{color:'#333'}}
              />
            </View>

            {// EVENTS
            }              
            <Events 
              activityType={this.state.activityType}
              selectedIndex={this.state.selectedIndex}
            />
          </View>
        </View>
      );
    } else {
      return (
        <Loading message='' indicator={false}/>
      )
    }

  }
}

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  loggedIn: state.loggedIn,
  friends: state.friends,
  fcm: state.fcm,
  error: state.error
})

export default connect(mapStateToProps)(Dashboard);
