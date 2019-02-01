import React from 'react';
import { View, Picker, DatePickerIOS, Dimensions, ProgressViewIOS } from 'react-native';
import { Input, Text, Header, Icon } from 'react-native-elements'
import SelectableFriendList from '../Friends/SelectableFriendList';
import SelectLocation from './SelectLocation';
import SaveCourt from './SaveCourt';
import { MAPBOX_ACCESS_TOKEN } from '../../../config'
import Mapbox from '@mapbox/react-native-mapbox-gl';
import { connect } from 'react-redux';
import { updateTempEventType, updateTempEvent, saveEvent, updateTempEventFriends } from '../../actions/Event';
import styles from '../styles/main';

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

let numOfSteps = 6;
export let eventTypes = ['Pickup', 'Game', 'Shootaround'];

class EventForm extends React.Component {
    completeEvent = () => {
        // save event to firebase
        this.props.dispatch(saveEvent(this.props.tempEvent));
    }
    handleError = (message) => {
        this.setState({error: {message}})
    }
    nextStep = () => { 
        this.props.dispatch(updateTempEvent(this.props.tempEvent.step + 1, 'step'))
    }
    skipStep = () => {
        this.props.dispatch(updateTempEvent(this.props.tempEvent.step + 2, 'step'))
    }
    resetCount = () => {
        this.props.dispatch(updateTempEvent(1, 'step'))
    }
    previousStep = () => {
        this.props.dispatch(updateTempEvent(this.props.tempEvent.step - 1, 'step'))
    }
    backTwoSteps = () => {
        this.props.dispatch(updateTempEvent(this.props.tempEvent.step - 2, 'step'))      
    }
    returnAnnotation = (coords) => { 
        return (
            <Mapbox.PointAnnotation
                key={"2"}
                id={"2"}
                coordinate={[coords.long, coords.lat]}
                title="annotation title"
            >
            </Mapbox.PointAnnotation>
        )  
    }
    renderPickerItems = () => {
        let pickerItems = eventTypes.map((type, index) => {
            return (
                <Picker.Item key={index} label={type} value={type} />
            )
        })
        return pickerItems;
    }
    render() {
        let progressPercent = this.props.tempEvent.step / numOfSteps;
        let saveCourt;
        if(this.props.tempEvent && this.props.tempEvent.court && !this.props.tempEvent.court.isSaved && this.props.tempEvent.court.selType !== 'saved') {
            saveCourt = 
                <SaveCourt 
                    close={this.props.onClose}
                    court={(this.props.tempEvent && this.props.tempEvent.court) ? this.props.tempEvent.court : null}
                    updateName={ (courtName) => this.props.dispatch(updateTempEvent(courtName, 'court'))}
                />
        }
        // compile selected friends into string
        let friends = this.props.tempEvent ? this.props.tempEvent.friends : null;
        let friendsListTemp = [];
        let friendsList;
        if(friends) {                    
            this.props.friends.forEach(f => {
                if(friends.includes(f.uid)) {
                    friendsListTemp.push(f.displayName)
                }
            })
            friendsList = friendsListTemp.join();
        } else {
            friendsList = 'None'
        }
        
        switch(this.props.tempEvent.step) {   
            case 1 :
            // EVENT TYPE
                return (
                    <View style={styles.centeredContainer}>
                        <Header
                            centerComponent={{ text: 'Event', style: { color: '#FFFFFF', fontSize:20 } }}
                            rightComponent={
                                    <Icon name='md-arrow-dropright'
                                        type='ionicon'
                                        color='#FFFFFF'
                                        size={60}
                                        underlayColor='#3578E5'
                                        containerStyle={{height:deviceHeight*.10,marginRight:10}} 
                                        onPress={()=> {this.nextStep()}}
                                    />
                            }
                            containerStyle={styles.headerContainer}
                        />
                        <ProgressViewIOS progress={progressPercent} style={styles.progressBar} progressTintColor='green'/>
                        <Picker
                            selectedValue={this.props.tempEvent.type}
                            style={{ width: deviceWidth*.75,height:deviceHeight*.40}}
                            onValueChange={value => this.props.dispatch(updateTempEventType(value))}
                        >
                            {this.renderPickerItems()}
                        </Picker>
                    </View>
                )
            case 2 :
            // DATE
                return (
                    <View style={styles.centeredContainer}>
                        <Header
                            centerComponent={{ text: 'Date', style: { color: '#FFFFFF', fontSize:20 } }}
                            leftComponent={
                                <Icon name='md-arrow-dropleft'
                                    type='ionicon'
                                    color='#FFFFFF'
                                    size={60}
                                    underlayColor='#3578E5'
                                    containerStyle={{height:deviceHeight*.10,marginLeft:10}} 
                                    onPress={()=> {this.previousStep()}}
                                />
                            }                            
                            rightComponent={
                                <Icon name='md-arrow-dropright'
                                    type='ionicon'
                                    color='#FFFFFF'
                                    size={60}
                                    underlayColor='#3578E5'
                                    containerStyle={{height:deviceHeight*.10,marginRight:10}} 
                                    onPress={()=> {{!this.props.friends || this.props.friends.length === 0 ? this.skipStep() : this.nextStep()} }}
                                />
                            }
                            containerStyle={styles.headerContainer}
                        />                     
                        <ProgressViewIOS progress={progressPercent} style={styles.progressBar} progressTintColor='green'/>
                        <DatePickerIOS
                            mode='date'
                            date={(this.props.tempEvent && this.props.tempEvent.date) ? this.props.tempEvent.date : new Date()}
                            style={{width: deviceWidth*.75,height:deviceHeight*.40}}
                            onDateChange={date => this.props.dispatch(updateTempEvent(date, 'date'))}
                        />                       
                    </View>
                )
            case 3: 
            // FRIENDS
                return (
                    <View style={styles.centeredContainer}>
                        <Header
                            centerComponent={{ text: 'Friends', style: { color: '#FFFFFF', fontSize:20 } }}
                            leftComponent={
                                <Icon name='md-arrow-dropleft'
                                    type='ionicon'
                                    color='#FFFFFF'
                                    size={60}
                                    underlayColor='#3578E5'
                                    containerStyle={{height:deviceHeight*.10,marginLeft:10}} 
                                    onPress={()=> {this.previousStep()}}
                                />
                            }                            
                            rightComponent={
                                <Icon name='md-arrow-dropright'
                                    type='ionicon'
                                    color='#FFFFFF'
                                    size={60}
                                    underlayColor='#3578E5'
                                    containerStyle={{height:deviceHeight*.10,marginRight:10}} 
                                    onPress={()=> this.nextStep() }
                                />
                            }
                            containerStyle={styles.headerContainer}
                        />                     
                        <ProgressViewIOS progress={progressPercent} style={styles.progressBar} progressTintColor='green'/>
                        <SelectableFriendList onFriendsChange={(friends) => this.props.dispatch(updateTempEventFriends(friends))}/>
                    </View>   
                )
            case 4 :
            // LOCATION
                return (
                    <View style={styles.centeredContainer}>
                        <Header
                            centerComponent={{ text: 'Location', style: { color: '#FFFFFF', fontSize:20 } }}
                            leftComponent={
                                <Icon name='md-arrow-dropleft'
                                    type='ionicon'
                                    color='#FFFFFF'
                                    size={60}
                                    underlayColor='#3578E5'
                                    containerStyle={{height:deviceHeight*.10,marginLeft:10}} 
                                    onPress={()=> {{!this.props.friends || this.props.friends.length === 0 ? this.backTwoSteps() : this.previousStep()}}}
                                />
                            }                            
                            rightComponent={
                                <Icon name='md-arrow-dropright'
                                    type='ionicon'
                                    color={this.props.tempEvent && !this.props.tempEvent.court ? '#444' : '#FFFFFF'}
                                    size={60}
                                    underlayColor='#3578E5'
                                    containerStyle={{height:deviceHeight*.10,marginRight:10}} 
                                    disabledStyle={{backgroundColor:'#3578E5'}}
                                    disabled={this.props.tempEvent && !this.props.tempEvent.court}
                                    onPress={()=> {{!this.props.friends || this.props.friends.length === 0 ? this.skipStep() : this.nextStep()} }}
                                />
                            }
                            containerStyle={styles.headerContainer}
                        />                     
                        <ProgressViewIOS progress={progressPercent} style={styles.progressBar} progressTintColor='green'/>
                        <SelectLocation 
                            tempEvent={this.props.tempEvent}
                            onSelect = { (coords, selType) => {
                                this.props.dispatch(updateTempEvent({...coords, selType}, 'court'));
                            }}
                        />
                    </View>
                )   
            case 5: 
            // COMMENT
                return (
                    <View style={styles.centeredContainer}>
                        <Header
                            centerComponent={{ text: 'Comment (optional)', style: { color: '#FFFFFF', fontSize:20 } }}
                            leftComponent={
                                <Icon name='md-arrow-dropleft'
                                    type='ionicon'
                                    color='#FFFFFF'
                                    size={60}
                                    underlayColor='#3578E5'
                                    containerStyle={{height:deviceHeight*.10,marginLeft:10}} 
                                    onPress={()=> { this.previousStep() }}
                                />
                            }                            
                            rightComponent={
                                <Icon name='md-arrow-dropright'
                                    type='ionicon'
                                    color='#FFFFFF'
                                    size={60}
                                    underlayColor='#3578E5'
                                    containerStyle={{height:deviceHeight*.10,marginRight:10}} 
                                    onPress={()=> { this.nextStep() }}
                                />
                            }
                            containerStyle={styles.headerContainer}
                        />                     
                        <ProgressViewIOS progress={progressPercent} style={styles.progressBar} progressTintColor='green'/>
                        <Input 
                            placeholder='How did it go?'
                            onChangeText={val => this.props.dispatch(updateTempEvent(val, 'comment'))}
                            containerStyle={{width: deviceWidth*.75,marginBottom: 50,marginTop:50}}
                            multiline
                            numberOfLines={5}
                            maxLength={75}
                            value={this.props.tempEvent.comment}
                            leftIcon={{name:'md-quote',type:'ionicon',size:20,marginRight:5,color:'#111'}}
                            inputStyle={{color: '#444'}}
                        />
                    </View>                   
                )
            case 6: 
            // CONFIRM and SAVE EVENT
                return (
                    <View style={styles.centeredContainer}>
                        <Header
                            centerComponent={{ text: 'Confirm and Save', style: { color: '#FFFFFF', fontSize:20 } }}
                            leftComponent={
                                <Icon name='md-arrow-dropleft'
                                    type='ionicon'
                                    color='#FFFFFF'
                                    size={60}
                                    underlayColor='#3578E5'
                                    containerStyle={{height:deviceHeight*.10,marginLeft:10}} 
                                    onPress={()=> { this.previousStep() }}
                                />
                            }                            
                            rightComponent={
                                <Icon name='md-checkmark'
                                    type='ionicon'
                                    color='#FFFFFF'
                                    size={40}
                                    underlayColor='#3578E5'
                                    containerStyle={{height:deviceHeight*.10,marginRight:10}} 
                                    onPress={()=> { this.completeEvent() }}
                                />
                            }
                            containerStyle={styles.headerContainer}
                        />  
                        <ProgressViewIOS progress={progressPercent} style={[styles.progressBar,{marginBottom:0}]} progressTintColor='green'/>
                        <View style={{justifyContent:'space-evenly'}}>
                            <View style={{height:deviceHeight*.20,width:deviceWidth*.98,marginBottom:10}}>
                                <Mapbox.MapView
                                    styleURL={Mapbox.StyleURL.Light}
                                    zoomLevel={15}
                                    centerCoordinate={[this.props.tempEvent.court.long, this.props.tempEvent.court.lat]}
                                    showUserLocation={false}
                                    style={{flex: 1}}
                                    logoEnabled={false}
                                >
                                    {this.returnAnnotation({lat: this.props.tempEvent.court.lat, long: this.props.tempEvent.court.long})}
                                </Mapbox.MapView> 
                            </View>
                            <View style={{height:deviceHeight*.35,flex:1,width:deviceWidth*.75,alignSelf:'center'}}>

                                <Text style={styles.modalHeader}>Event</Text>
                                <View style={styles.evenSpacedRow}>
                                    <Text>{this.props.tempEvent.type}</Text>
                                </View> 

                                <Text style={styles.modalHeader}>Date</Text>
                                <View style={styles.evenSpacedRow}>
                                    <Text>{this.props.tempEvent.date.toLocaleDateString()}</Text>
                                </View> 

                                <Text style={styles.modalHeader}>Friends</Text>
                                <View style={styles.evenSpacedRow}>
                                    <Text>{friendsList}</Text>
                                </View> 

                                <Text style={styles.modalHeader}>Comment</Text>
                                <View style={styles.evenSpacedRow}>
                                    <Text>{this.props.tempEvent.comment || '-'}</Text>
                                </View> 

                            </View>
                        </View>
                    </View>
                )
            // (OPTIONAL) SAVE COURT
            case 7: 
                return (
                    <View style={styles.centeredContainer}>
                        {saveCourt}
                    </View>
                )
        }
    }
}

const mapStateToProps = (state) => ({
    friends: state.friends,
    tempEvent: state.tempEvent,
    currentUser: state.currentUser
  })
export default connect(mapStateToProps)(EventForm);



