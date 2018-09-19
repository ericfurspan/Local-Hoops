import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import firebase from 'react-native-firebase'
import _ from 'lodash';
import { updateEvents, updateEventsRequest } from '../actions/auth';
import { connect } from 'react-redux';
import Loading from './Loading';
import Timeline from 'react-native-timeline-listview'

class Events extends React.Component {

    componentDidMount() {
        //fetch both user and friends events
        this.fetchUserEvents()
        this.fetchFriendsEvents()
    }

    fetchUserEvents = () => {
        let events = [];

        console.log('fetching My Activity')
        let counter = 0;
        firebase.firestore().collection('events').where("event_author", "==", this.props.currentUser.uid) 
        .get()
        .then(eventsSnapshot => {
            eventsSnapshot.forEach(doc => {
                const { type, date, event_author, comment } = doc.data();
                let event = {
                    doc, 
                    id: doc.id,
                    type,
                    event_author,
                    participants: [],
                    date,
                    comment,
                } 
                // add participants sub collection to event object
                firebase.firestore().collection('events').doc(event.id).collection('participants')
                .get()
                .then(participantsSnapshot => {
                    participantsSnapshot.forEach(doc => {
                        if(doc.exists) {
                            // add participant to event
                            let { displayName, uid } = doc.data();
                            let participant = { displayName, uid }
                            event['participants'].push(participant)
                        }
                    })
                    events.push(event);
                    counter++;
                    return counter;
                })
                .then((counter) => {
                    // if all events have been retrieved, call updateEvents(events)
                    if(counter === eventsSnapshot.size) {
                        this.props.dispatch(updateEvents('user', events))
                    }
                })
            })
        })
    }
    fetchFriendsEvents = () => {
        let events = [];

        console.log('fetching Friend Activity')
        // first get current users' friend list
        firebase.firestore().doc(`users/${this.props.currentUser.uid}`)
        .get()
        .then(doc => {
            return doc.data().friends
        })
        // then search the participants sub collection of the event
        .then(friends => {
            firebase.firestore().collection('events')
            .get()
            .then(eventsSnapshot => {
                eventsSnapshot.forEach(doc => {
                    const { type, date, event_author, comment } = doc.data();
                    let event = {
                        doc, 
                        id: doc.id,
                        type,
                        event_author,
                        participants: [],
                        date,
                        comment,
                    }
                    firebase.firestore().collection('events').doc(doc.id).collection('participants')
                    .get()
                    .then(participantsSnapshot => {
                        for(let i=0; i<participantsSnapshot.size;i++) {
                            if(participantsSnapshot.docs[i].exists) {
                                console.log(participantsSnapshot.docs[i].data())
                                // if participant uid is in friends array, add event to events array
                                if(friends.includes(participantsSnapshot.docs[i].data().uid)) {
                                    // add participants to event
                                    let participants = participantsSnapshot.docs.map(doc => doc.data())
                                    event['participants'] = participants;
                                    events.push(event)
                                    break;
                                }
                            }
                        }
                    })
                    .then(() => {
                        console.log(events)
                        this.props.dispatch(updateEvents('friends', events))
                    })
                    .catch(e => {console.error(e)})
                })
            })
            .catch(e => {console.error(e)})
        })        
    }

    render() {        
        if(this.props.events) {
            let events;
            switch(this.props.activityType) {
                case 'My Activity':
                    if(this.props.events.user) events = this.props.events.user
                    else return <Loading />
                    break;
                case 'Friends Activity':
                    if(this.props.events.friends) events = this.props.events.friends
                    else return <Loading />
                    break;
                case 'All Activity':
                    if(this.props.events.friends && this.props.events.user) {
                        events = [...this.props.events.user, ...this.props.events.friends]
                    } else return <Loading />
                    break;
            }
            let timelineData = events.map(event => {
                let participants = event.participants.map(p=>p.displayName).join(", ")
                return {
                    time: event.date,
                    title: event.type,
                    description: `${event.comment}. Participants: ${participants}`,
                    icon: require('../assets/img/ball.png')
                }
            })
            return (
                <Timeline
                    data={timelineData}
                    columnFormat='single-column-left'
                    innerCircle='icon'
                    circleColor='black'
                    rowContainerStyle={{minWidth: 250}}
                    timeContainerStyle={{maxWidth: 75}}
                    timeStyle={{textAlign: 'center', backgroundColor:'#FAFAFA', color:'#4B4B4B', padding:5, borderRadius:13}}

                />
            )
        } else {return <Loading />}
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50
    },
    eventContainer: {
        marginBottom: 10
    },
    eventType: {

    },
    eventWeather: {

    },
    eventComment: {
        
    }

})

const mapStateToProps = (state, props) => ({
    currentUser: state.currentUser,
    events: state.events,
    loading: state.loading
})

export default connect(mapStateToProps)(Events);