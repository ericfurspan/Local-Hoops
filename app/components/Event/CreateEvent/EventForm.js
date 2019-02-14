import React from 'react';
import { View, Picker, DatePickerIOS, Dimensions, ProgressViewIOS } from 'react-native';
import { Input, Header, Icon } from 'react-native-elements'
import SelectableFriendList from '../../Friends/SelectableFriendList';
import SelectLocation from './SelectLocation';
import SaveCourt from './SaveCourt';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import { connect } from 'react-redux';
import { updateTempEventType, updateTempEvent, saveEvent, updateTempEventParticipants } from '../../../actions/Event';
import styles from '../../styles/main';
import { MAPBOX_ACCESS_TOKEN } from '../../../../config'
import EventCard from '../EventCard';

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
        
        let participants = this.props.tempEvent && this.props.tempEvent.participants ? 
            this.props.friends.map(f=> {
                if(this.props.tempEvent.participants.includes(f.uid)) {
                    return f
                }
            })
        : [];

        participants.push(this.props.currentUser);

        switch(this.props.tempEvent.step) {   
            case 1 :
            // EVENT TYPE
                return (
                    <View style={styles.centeredContainer}>
                        <Header
                            centerComponent={{ text: 'Activity', style: { color: '#FFFFFF', fontSize:26 } }}
                            rightComponent={
                                <Icon name='md-calendar'
                                    type='ionicon'
                                    color='#FFFFFF'
                                    size={40}
                                    underlayColor='#3578E5'
                                    containerStyle={{marginRight:5}} 
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
                            centerComponent={{ text: 'Date', style: { color: '#FFFFFF', fontSize:26 } }}
                            leftComponent={
                                <Icon name='ios-arrow-back'
                                    type='ionicon'
                                    color='#FFFFFF'
                                    size={40}
                                    underlayColor='#3578E5'
                                    containerStyle={{marginLeft:5}} 
                                    onPress={()=> {this.previousStep()}}
                                />
                            }                            
                            rightComponent={
                                <Icon name='md-people'
                                    type='ionicon'
                                    color='#FFFFFF'
                                    size={40}
                                    underlayColor='#3578E5'
                                    containerStyle={{marginRight:5}} 
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
                            centerComponent={{ text: 'Tag Friends', style: { color: '#FFFFFF', fontSize:26 } }}
                            leftComponent={
                                <Icon name='ios-arrow-back'
                                    type='ionicon'
                                    color='#FFFFFF'
                                    size={40}
                                    underlayColor='#3578E5'
                                    containerStyle={{marginLeft:5}} 
                                    onPress={()=> {this.previousStep()}}
                                />
                            }                            
                            rightComponent={
                                <Icon name='md-pin'
                                    type='ionicon'
                                    color='#FFFFFF'
                                    size={40}
                                    underlayColor='#3578E5'
                                    containerStyle={{marginRight:5}} 
                                    onPress={()=> this.nextStep() }
                                />
                            }
                            containerStyle={styles.headerContainer}
                        />                     
                        <ProgressViewIOS progress={progressPercent} style={styles.progressBar} progressTintColor='green'/>
                        <SelectableFriendList onParticipantsChange={(participants) => this.props.dispatch(updateTempEventParticipants(participants))}/>
                    </View>   
                )
            case 4 :
            // LOCATION
                return (
                    <View style={styles.centeredContainer}>
                        <Header
                            centerComponent={{ text: 'Location', style: { color: '#FFFFFF', fontSize:26 } }}
                            leftComponent={
                                <Icon name='ios-arrow-back'
                                    type='ionicon'
                                    color='#FFFFFF'
                                    size={40}
                                    underlayColor='#3578E5'
                                    containerStyle={{marginLeft:5}} 
                                    onPress={()=> {{!this.props.friends || this.props.friends.length === 0 ? this.backTwoSteps() : this.previousStep()}}}
                                />
                            }                            
                            rightComponent={
                                <Icon name='md-text'
                                    type='ionicon'
                                    color={this.props.tempEvent && !this.props.tempEvent.court ? '#444' : '#FFFFFF'}
                                    size={40}
                                    underlayColor='#3578E5'
                                    containerStyle={{marginRight:5}} 
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
                            centerComponent={{ text: 'Comment', style: { color: '#FFFFFF', fontSize:26 } }}
                            leftComponent={
                                <Icon name='ios-arrow-back'
                                    type='ionicon'
                                    color='#FFFFFF'
                                    size={40}
                                    underlayColor='#3578E5'
                                    containerStyle={{marginLeft:5}} 
                                    onPress={()=> { this.previousStep() }}
                                />
                            }                            
                            rightComponent={
                                <Icon name='md-list-box'
                                    type='ionicon'
                                    color='#FFFFFF'
                                    size={40}
                                    underlayColor='#3578E5'
                                    containerStyle={{marginRight:5}} 
                                    onPress={()=> { this.nextStep() }}
                                />
                            }
                            containerStyle={styles.headerContainer}
                        />                     
                        <ProgressViewIOS progress={progressPercent} style={styles.progressBar} progressTintColor='green'/>
                        <Input 
                            placeholder='How did it go? (optional)'
                            onChangeText={val => this.props.dispatch(updateTempEvent(val, 'comment'))}
                            containerStyle={{width: deviceWidth*.75,marginBottom: 50,marginTop:50}}
                            multiline
                            numberOfLines={5}
                            maxLength={75}
                            value={this.props.tempEvent.comment}
                            leftIcon={{name:'ios-quote',type:'ionicon',size:20,marginRight:5,color:'#444'}}
                            inputStyle={{marginLeft:10,color:'#333'}}
                        />
                    </View>                   
                )
            case 6: 
            // SAVE EVENT
                return (
                    <View style={styles.centeredContainer}>
                        <Header
                            centerComponent={{ text: 'Save', style: { color: '#FFFFFF', fontSize:26 } }}
                            leftComponent={
                                <Icon name='ios-arrow-back'
                                    type='ionicon'
                                    color='#FFFFFF'
                                    size={40}
                                    underlayColor='#3578E5'
                                    containerStyle={{marginLeft:5}} 
                                    onPress={()=> { this.previousStep() }}
                                />
                            }                            
                            rightComponent={
                                <Icon name='md-done-all'
                                    type='ionicon'
                                    color='#FFFFFF'
                                    size={40}
                                    underlayColor='#3578E5'
                                    containerStyle={{marginRight:5}} 
                                    onPress={()=> { this.completeEvent() }}
                                />
                            }
                            containerStyle={styles.headerContainer}
                        />  
                        <ProgressViewIOS progress={progressPercent} style={[styles.progressBar,{marginBottom:0}]} progressTintColor='green'/>
                        <EventCard 
                            event={ { ...this.props.tempEvent, participants, date: this.props.tempEvent.date.toLocaleDateString('en-US',{year:'2-digit',month:'2-digit',day:'2-digit'}) }}
                        />
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



