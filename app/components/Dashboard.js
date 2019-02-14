import React from 'react';
import { View, Modal, Dimensions, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Button, Header, ButtonGroup, Text, Divider } from 'react-native-elements';
import { connect } from 'react-redux';
import Loading from './Loading';
import Events from './Event/Events';
import EventForm from './Event/CreateEvent/EventForm';
import IonIcon from 'react-native-vector-icons/Ionicons';
// import { Dropdown } from 'react-native-material-dropdown';
import { getFriends,  } from '../actions/User';
import { getSavedCourts } from '../actions/Court';
import { updateLocation, locationError, toggleLocation } from '../actions/Location';
import ErrorMessage from './ErrorMessage';
import { Cancel } from './navButtons';
import styles from './styles/main';
import FCM from './FCM';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import { MAPBOX_ACCESS_TOKEN } from '../../config';

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);
let deviceWidth = Dimensions.get('window').width;
let deviceHeight= Dimensions.get('window').height;

// let activityTypes = [{value: 'All'}, {value: 'Friends'}, {value: 'Only Me'}];

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

    this.props.dispatch(getSavedCourts());
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
  returnAnnotation = (coords) => { 
    return (
        <Mapbox.PointAnnotation
            key={"2"}
            id={"2"}
            coordinate={[coords.longitude, coords.latitude]}
            title="annotation title"
        >
          <IonIcon
              name='ios-pin'
              size={30}
              color='red'  
          />
        </Mapbox.PointAnnotation>
    )  
}
  render() {
    if(this.props.error) {
      return <ErrorMessage message={this.props.error}/>
    }

    const eventViewBtns = ['Timeline', 'List'];

    if(this.props.currentUser) { 
      
      return (
        <View style={styles.container}>
          
          {// hide status bar when modal visible
          }
          {this.state.showEventFormModal ? 
            <StatusBar hidden/>
            : null
          }
          <Header
              centerComponent={{ text: 'Local Hoops', style: { color: '#FFFFFF', fontSize:24, fontFamily: 'ArchitectsDaughter-Regular' } }} //ArchitectsDaughter-Regular
              containerStyle={styles.dashHeader}
          />
          
            <FCM />
          
          <View style={[styles.centeredContainer,{paddingBottom:20}]}>  
          
            <ScrollView>

              {// SAVED COURTS
              }
              <View>
                <View style={{width:deviceWidth,flexDirection:'row',justifyContent:'flex-start',marginTop:15}}>
                      <Text style={styles.header}>Saved Courts</Text>                                      
                </View>

                <ScrollView 
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{marginLeft:10}}
                >
                  {this.props.savedCourts && this.props.savedCourts.map(court => {
                    return (
                      <TouchableOpacity key={court.id} style={{width:deviceWidth*.35,marginLeft:10,marginTop:10,justifyContent:'flex-start'}}>
                        <View style={{height:135,marginBottom:5}}>
                          <Mapbox.MapView
                              scrollEnabled={false}
                              styleURL={Mapbox.StyleURL.Street}
                              zoomLevel={14}
                              centerCoordinate={[court.coords._longitude, court.coords._latitude]}
                              showUserLocation={false}
                              style={{flex: 1}}
                              logoEnabled={false}
                              onPress= {() => { // navigate to this court in the Explore screen
                                this.props.navigation.navigate('Explore', {court})
                              }}
                          >
                            {this.returnAnnotation(court.coords)}
                          </Mapbox.MapView> 
                        </View>
                        <Text style={{fontWeight:'500',textAlign:'center',fontSize:16}}>{court.name}</Text>
                      </TouchableOpacity>
                    )
                  })}
                </ScrollView>
              </View>

              <Divider style={{marginBottom:30,marginTop:30,width:deviceWidth*.9,alignSelf:'center'}}/>   


              {// RECENT ACTIVITY
              }
              <View style={{height:deviceHeight*.6,alignItems:'center'}}>
                <View style={{width:deviceWidth,flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={styles.header}>Recent Activity</Text>
                    <Button
                      onPress={() => this.setEventFormModalVisible(true)}
                      icon={{name:'md-add',type:'ionicon',size:16,color:'#fff'}}
                      title='New Event'
                      type='outline'
                      raised
                      buttonStyle={{backgroundColor:'#3578E5'}}
                      containerStyle={{marginRight:10}}
                      titleStyle={{color:'#fff',fontSize:14,fontWeight:'500'}}
                    />
                </View>          

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

                {/* ACTIVITY TYPE
                
                <View style={{alignSelf:'flex-start',marginLeft:25}}>
                  <Dropdown
                    data={activityTypes}
                    value={this.state.activityType}
                    containerStyle={{width: 100,backgroundColor:'transparent'}}
                    itemColor='#333'
                    onChangeText={val => this.setState({activityType: val})}
                  />
                </View>
                */}

                {// TIMELINE / LIST OPTION
                }              
                <View style={{alignSelf:'center',width:200,marginBottom:10,marginTop:10}}>
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
            </ScrollView>
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
  savedCourts: state.savedCourts,
  fcm: state.fcm,
  error: state.error
})

export default connect(mapStateToProps)(Dashboard);
