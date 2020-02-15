import firebase from 'react-native-firebase';

export const UPDATE_EVENTS = 'UPDATE_EVENTS';
export const updateEvents = (category, events) => ({
  type: UPDATE_EVENTS,
  events,
  category,
});
export const UPDATE_TEMPEVENT_PARTICIPANTS = 'UPDATE_TEMPEVENT_PARTICIPANTS';
export const updateTempEventParticipants = (participants) => ({
  type: UPDATE_TEMPEVENT_PARTICIPANTS,
  participants,
});
export const UPDATE_TEMPEVENT_TYPE = 'UPDATE_TEMPEVENT_TYPE';
export const updateTempEventType = (data) => ({
  type: UPDATE_TEMPEVENT_TYPE,
  data,
});
export const UPDATE_TEMPEVENT = 'UPDATE_TEMPEVENT';
export const updateTempEvent = (data, field) => ({
  type: UPDATE_TEMPEVENT,
  data,
  field,
});
export const RESET_TEMPEVENT = 'RESET_TEMPEVENT';
export const resetTempEvent = () => ({
  type: RESET_TEMPEVENT,
});
export const CLEAR_TEMP_EVENT = 'CLEAR_TEMP_EVENT';
export const clearTempEvent = () => ({
  type: CLEAR_TEMP_EVENT,
});
export const SAVE_EVENT_REQUEST = 'SAVE_EVENT_REQUEST';
export const saveEventRequest = () => ({
  type: SAVE_EVENT_REQUEST,
});
export const SAVE_EVENT_SUCCESS = 'SAVE_EVENT_SUCCESS';
export const saveEventSuccess = (event) => ({
  type: SAVE_EVENT_SUCCESS,
  event,
});
export const SAVE_EVENT_ERROR = 'SAVE_EVENT_ERROR';
export const saveEventError = (error) => ({
  type: SAVE_EVENT_ERROR,
  error,
});
export const DELETE_EVENT_REQUEST = 'DELETE_EVENT_REQUEST';
export const deleteEventRequest = () => ({
  type: DELETE_EVENT_REQUEST,
});
export const DELETE_EVENT_SUCCESS = 'DELETE_EVENT_SUCCESS';
export const deleteEventSuccess = (eventId) => ({
  type: DELETE_EVENT_SUCCESS,
  eventId,
});
export const DELETE_EVENT_ERROR = 'DELETE_EVENT_ERROR';
export const deleteEventError = (error) => ({
  type: DELETE_EVENT_ERROR,
  error,
});
export const saveEvent = (event) => (dispatch, getState) => {
  dispatch(saveEventRequest());

  let participants = [getState().currentUser.uid];

  event.participants && event.participants.forEach(p=>participants.push(p));

  // create event
  firebase.firestore().collection('events')
    .add({
      comment: event.comment || '',
      date: (new Date(event.date)).toLocaleDateString('en-US',{year: '2-digit',month: '2-digit',day: '2-digit'}),
      event_author: getState().currentUser.uid,
      type: event.type,
      court: event.court,
      participants: participants,
    })
    .then((res) => {
      participants.forEach(uid => {
        // get users displayName
        firebase.firestore().doc(`users/${uid}`)
          .get()
          .then(doc => {
            return doc.data().displayName;
          })
          .then(() => {
            // update users' events array
            firebase.firestore().collection('users').doc(uid)
              .update({
                events: firebase.firestore.FieldValue.arrayUnion(res.id),
              });
          });
      });
      // reset temp event
      dispatch(resetTempEvent());

      // dispatch a success
      dispatch(saveEventSuccess());
    })
    .catch( error => {
      dispatch(saveEventError(error));
    });
};

export const deleteEvent = (event) => (dispatch, getState) => {
  dispatch(deleteEventRequest());
  if (event.event_author !== getState().currentUser.uid) {
    return dispatch(deleteEventError('Only the event author may delete events'));
  }
  let counter = 0;
  for (let i = 0; i < event.participants.length; i++) {
    // delete event from users
    firebase.firestore().collection('users').doc(event.participants[i].uid)
      .update({
        events: firebase.firestore.FieldValue.arrayRemove(event.id),
      });
    counter++;
    if (counter === event.participants.length) {
      firebase.firestore().doc(`events/${event.id}`)
        .delete()
        .then(() => {
          dispatch(deleteEventSuccess(event.id));
        })
        .catch(error => {
          dispatch(deleteEventError(error));
        });
    }
  }
};
