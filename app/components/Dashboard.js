import React from 'react';
import { Text, View, Modal, Dimensions, StatusBar } from 'react-native';
import { Button, Header, ButtonGroup } from 'react-native-elements';
import { connect } from 'react-redux';
import Loading from './Loading';
import Events from './Events';
import EventForm from './CreateEvent/EventForm';
import { Dropdown } from 'react-native-material-dropdown';
import { getFriends, updateUserLoc } from '../actions/User';
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
    eventViewIndex: 0,
  }
  static navigationOptions = {
    title: 'Dashboard',
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
  updateEventViewIndex = (eventViewIndex) => {
    this.setState({eventViewIndex})
  }
  // Finds user location
  getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      this.props.dispatch(updateUserLoc(position.coords));
    }, err => console.error(err.message)),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
  }

  render() {
    let eventViewType0, eventViewType1;
    if(this.props.error) {
      return <ErrorMessage message={this.props.error}/>
    }
    if(this.props.currentUser) {
      console.log('rendering Dashboard')

      eventViewType0 = () => <Text>Timeline</Text>
      eventViewType1 = () => <Text>List</Text>

      const eventViewTypeButtons = [{ element: eventViewType0 }, { element: eventViewType1 }]

      return (
        <View style={styles.container}>
          <StatusBar barStyle="light-content" translucent/>
          <Header
              centerComponent={{ text: 'LocalBall', style: { color: '#FFFFFF', fontSize:24, fontFamily: 'ArchitectsDaughter-Regular' } }}
              containerStyle={{
                  backgroundColor: '#3578E5',
                  justifyContent: 'space-around',
                  height:deviceHeight*.12
              }}
          />
            <FCM />
          

          <View style={[styles.centeredContainer,{paddingTop:20}]}>

            {/* SAVED COURTS
            
            <View style={{width:deviceWidth,flexDirection:'row',justifyContent:'space-between'}}>
                <Text style={styles.header}>Saved Courts</Text>
            </View>
            <Divider style={styles.divider}/>
            */}

            {// RECENT ACTIVITY
            }
            <View style={{width:deviceWidth,flexDirection:'row',justifyContent:'space-between'}}>
                <Text style={styles.header}>Recent Activity</Text>
                <Button
                  onPress={() => this.setEventFormModalVisible(true)}
                  icon={{name:'md-add',type:'ionicon',size:16,color:'#3578E5'}}
                  title='New Event'
                  titleStyle={{color:'#3578E5',fontSize:14,fontWeight:'500'}}
                  buttonStyle={{backgroundColor:'transparent'}}
                />
              </View>
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

              <View style={{alignSelf:'flex-start',marginLeft:25}}>
                <Dropdown
                  data={activityTypes}
                  value={this.state.activityType}
                  containerStyle={{width: 100,backgroundColor:'transparent'}}
                  itemColor='#333'
                  onChangeText={val => this.setState({activityType: val})}
                />
              </View>
              
              <View style={{alignSelf:'center',width:200,marginBottom:10}}>
                <ButtonGroup
                  onPress={this.updateEventViewIndex}
                  selectedIndex={this.state.eventViewIndex}
                  buttons={eventViewTypeButtons}
                  buttonStyle={{backgroundColor:'#FAFAFA'}}
                  selectedButtonStyle={{backgroundColor:'#FFFFFF'}}
                />
              </View>
              
              <Events 
                activityType={this.state.activityType}
                eventViewIndex={this.state.eventViewIndex}
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
