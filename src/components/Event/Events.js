import React from 'react';
import { RefreshControl, ScrollView, Dimensions, FlatList, View, StatusBar, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import firebase from '@react-native-firebase/app';
import crashlytics from '@react-native-firebase/crashlytics';
import { connect } from 'react-redux';
import Timeline from 'react-native-timeline-flatlist';
import FacePile from 'react-native-face-pile';
// import Mapbox from '@react-native-mapbox-gl/maps';
import EventModal from './EventModal';
// import { MAPBOX_ACCESS_TOKEN } from '../../../config';
import { sortByDateDesc } from '../../../assets/helper';
import BallIcon from '../../../assets/img/nyk.png';
import { updateEvents } from '../../actions/Event';

// Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

const deviceWidth = Dimensions.get('window').width;

class Events extends React.Component {
  constructor(props) {
    super(props);
    this.unsubscribeUserEvents = null;
    this.state = {
      refreshing: false,
      modalVisible: false,
      selectedEvent: null,
    };
  }

  componentDidMount() {
    if (this.props.loggedIn) {
      // Fetch events for User
      this.fetchUserEvents();

      // If user has friends, fetch their events
      if (this.props.currentUser.friends && this.props.currentUser.friends.length >= 1) {
        this.fetchFriendsEvents();
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loading === true && this.props.loading === false) {
      this.onRefresh();
    }
  }

  componentWillUnmount() {
    this.unsubscribeUserEvents();
  }

  // changes visibility of modal
  setModalVisible = (visible, item) => {
    this.setState({
      modalVisible: visible,
      selectedEvent: item,
    });
  };

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.fetchUserEvents();
    this.fetchFriendsEvents();
    this.setState({ refreshing: false });
  };

  fetchUserEvents = () => {
    this.unsubscribeUserEvents = firebase
      .firestore()
      .collection('events')
      .where('participants', 'array-contains', this.props.currentUser.uid)
      .onSnapshot(
        (eventsSnapshot) => {
          if (!eventsSnapshot.empty) {
            const events = [];
            let counter = 0;
            eventsSnapshot.forEach((doc) => {
              const { type, date, event_author, comment, court } = doc.data();
              const event = {
                doc,
                id: doc.id,
                type,
                event_author,
                participants: [],
                court,
                date,
                comment,
              };
              firebase
                .firestore()
                .doc(`events/${event.id}`)
                .get()
                .then((doc) => {
                  const { participants } = doc.data();
                  participants.forEach((uid) => {
                    // get user info and add as participant to event
                    firebase
                      .firestore()
                      .doc(`users/${uid}`)
                      .get()
                      .then((doc) => {
                        const participant = doc.data();
                        event.participants.push(participant);
                      });
                  });
                  // only load this event if the current user is a participant
                  if (doc.data().participants.includes(this.props.currentUser.uid)) {
                    events.push(event);
                  }
                  counter++;
                  return counter;
                })
                .then((counter) => {
                  // if all events have been retrieved, call updateEvents(events)
                  if (counter === eventsSnapshot.size) {
                    this.props.dispatch(updateEvents('user', events));
                  }
                })
                .catch((e) => {
                  crashlytics().recordError(error);
                });
            });
          } else {
            this.props.dispatch(updateEvents('user', null));
          }
        },
        (error) => {
          crashlytics().recordError(error);
        }
      );
  };

  fetchFriendsEvents = () => {
    const events = [];
    let counter = 0;

    const { friends } = this.props.currentUser;
    if (friends && friends.length > 0) {
      friends.forEach((uid) => {
        firebase
          .firestore()
          .doc(`users/${uid}`)
          .get()
          .then((doc) => {
            // loop through events array and add each event to events[]
            const friendEvents = doc.data().events;
            friendEvents &&
              friendEvents.forEach((eventId) => {
                firebase
                  .firestore()
                  .doc(`events/${eventId}`)
                  .get()
                  .then((doc) => {
                    if (doc.exists) {
                      const { type, date, event_author, comment, court } = doc.data();
                      const event = {
                        doc,
                        uid,
                        id: doc.id,
                        type,
                        event_author,
                        participants: [],
                        court,
                        date,
                        comment,
                      };
                      const { participants } = doc.data();
                      participants.forEach((uid) => {
                        // get user info and add as participant to event
                        firebase
                          .firestore()
                          .doc(`users/${uid}`)
                          .get()
                          .then((doc) => {
                            const participant = doc.data();
                            event.participants.push(participant);
                          });
                      });
                      events.push(event);
                      counter++;
                      return counter;
                    }
                  })
                  .then((counter) => {
                    if (counter === friendEvents.length) {
                      this.props.dispatch(updateEvents('friends', events));
                    }
                  })
                  .catch((error) => {
                    crashlytics().recordError(error);
                  });
              });
          })
          .catch((error) => {
            crashlytics().recordError(error);
          });
      });
    } else {
      this.props.dispatch(updateEvents('friends', null));
    }
  };

  render() {
    let modal, eventsView;

    if (this.props.events) {
      let events, userEventsExists, friendsEventsExists;
      this.props.events.user ? (userEventsExists = true) : (userEventsExists = false);
      this.props.events.friends ? (friendsEventsExists = true) : (friendsEventsExists = false);
      switch (this.props.activityType) {
        case 'Only Me':
          if (userEventsExists) {
            events = this.props.events.user;
          } else {
            return null;
          }
          break;
        case 'Friends':
          if (friendsEventsExists) {
            events = this.props.events.friends;
          } else {
            return null;
          }
          break;
        case 'All':
          if (userEventsExists && friendsEventsExists) {
            events = [...this.props.events.user, ...this.props.events.friends];
            // filters for only unique events
            events = events.filter((e, i) => events.findIndex((a) => a.id === e.id) === i);
          } else if (userEventsExists && !friendsEventsExists) {
            events = this.props.events.user;
          } else if (!userEventsExists && friendsEventsExists) {
            events = this.props.events.friends;
          } else {
            return null;
          }
          break;
      }

      // determine how events will be rendered
      const eventsData = events.map((event, i) => {
        return {
          time: event.date,
          title: event.type,
          type: event.type,
          date: event.date,
          description: `${event.comment}`,
          icon: BallIcon,
          event_author: event.event_author,
          participants: event.participants,
          comment: event.comment,
          court: event.court,
          id: event.id,
          key: i.toString(),
        };
      });
      // sort events by date descending
      eventsData.sort(sortByDateDesc);

      if (this.props.selectedIndex === 0) {
        eventsView = (
          <Timeline
            data={eventsData}
            columnFormat="single-column-left"
            innerCircle="icon"
            titleStyle={{ color: '#333' }}
            descriptionStyle={{ color: '#333' }}
            circleColor="rgba(0,0,0,0)"
            lineColor="#3578E5"
            rowContainerStyle={{ minWidth: 250 }}
            timeContainerStyle={{ minWidth: 72 }}
            timeStyle={{
              textAlign: 'center',
              backgroundColor: 'transparent',
              color: '#333',
              padding: 5,
              borderRadius: 13,
            }}
            onEventPress={(event) => this.setModalVisible(true, event)}
          />
        );
      } else if (this.props.selectedIndex === 1 || !this.props.selectedIndex) {
        eventsView = (
          <FlatList
            data={eventsData}
            renderItem={({ item }) => (
              <ListItem
                containerStyle={{ width: deviceWidth }}
                key={item.key}
                rightTitle={item.type}
                rightElement={<Text>{item.date}</Text>}
                leftElement={
                  <View>
                    <FacePile
                      numFaces={3}
                      faces={item.participants.map((p, i) => {
                        return {
                          id: i,
                          imageUrl: p.photoURL,
                        };
                      })}
                    />
                  </View>
                }
                bottomDivider
                onPress={() => this.setModalVisible(true, item)}
              />
            )}
          />
        );
      }
      if (this.state.modalVisible) {
        modal = (
          <View>
            <StatusBar hidden />
            <EventModal
              setModalVisible={this.setModalVisible}
              event={this.state.selectedEvent}
              navigation={this.props.navigation}
            />
          </View>
        );
      }
      return (
        <ScrollView
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
        >
          {modal}
          {eventsView}
        </ScrollView>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  loggedIn: state.loggedIn,
  events: state.events,
  friends: state.friends,
  loading: state.loading,
});

export default connect(mapStateToProps)(Events);
