import React from 'react';
import { View, Text, StyleSheet, Picker, TouchableOpacity, DatePickerIOS } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';

let fieldValues = {
    type: null,
    event_author: null,
    date: null,
    participants: null,
    comment: null
}
let eventTypes = ['Pickup', 'League', 'Practice'];

class EventForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            tempEvent: {
                type: eventTypes[0],
                event_author: props.currentUser.displayName,
                date: new Date(),
                participants: null,
                comment: null
            },
            error: {
                message: null
            }
        }
    }
    handleError = (message) => {
        this.setState({error: {message}})
    }
    nextStep = () => { 
        this.setState({
            step: this.state.step + 1
        })
    }
    resetCount = () => {
        this.setState({
            step: 1
        })
    }
    previousStep = () => {
        this.setState({
            step: this.state.step - 1
        })
    }
    clearFieldValues = () => {
        fieldValues = {
            name: null,
            description: null,
            directive: null,
            contents: []
        }
    }
    handleChange = (field, val) => {
        this.setState({
            tempEvent: {
                ...this.state.tempEvent,
                [field]: val
            }
        })
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
        console.log(this.state.tempEvent)
        switch(this.state.step) {            
            case 1 :
                return (
                    <View style={styles.container}>
                        <Text>Select an Event Type</Text>
                        <Picker
                            selectedValue={this.state.tempEvent.type}
                            style={{ height: 50, width: 100 }}
                            onValueChange={value => this.handleChange('type', value)}
                        >
                            <Text>{this.state.tempEvent.type}</Text>   
                            {this.renderPickerItems()}
                        </Picker>
                        <View style={styles.bottomMiddle}>
                            <TouchableOpacity
                                onPress={() => this.nextStep()}>
                                <IonIcon name='md-arrow-forward' size={35} color='#444'/>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            case 2 :
                return (
                    <View style={styles.container}>
                        <Text>Select a Date</Text>
                        <DatePickerIOS
                            mode='date'
                            date={this.state.tempEvent.date}
                            style={{height: 50, width: 300}}
                            onDateChange={date => this.handleChange('date', date)}
                        />    
                        <View style={[styles.bottomMiddle, styles.inlineItems]}>
                            <TouchableOpacity
                                onPress={() => this.previousStep()}>
                                <IonIcon name='md-arrow-back' size={35} color='#444'/>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.navBtn}
                                onPress={() => this.nextStep()}>
                                <IonIcon name='md-arrow-forward' size={35} color='#444'/>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            case 3: 
                return (
                    //Picker with all nearby locations and a form
                    //to discover new court using mapview and dropping pin
                    <View style={[styles.bottomMiddle, styles.inlineItems]}>
                        <TouchableOpacity
                            onPress={() => this.previousStep()}>
                            <IonIcon name='md-arrow-back' size={35} color='#444'/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.navBtn}
                            onPress={() => this.nextStep()}>
                            <IonIcon name='md-arrow-forward' size={35} color='#444'/>
                        </TouchableOpacity>
                    </View>                    
                )
            case 4 :
                return (
                    null
                )
            default : 
                return (null)
        }
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      marginTop: 50
    },
    bottomMiddle: {
        position: 'absolute',
        bottom: '40%',
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inlineItems: {
        alignItems: 'flex-start',
        flexDirection:'row',
    },
    navBtn: {
        marginLeft: 20
    }
});

export default EventForm;



