import React from 'react';
import { connect } from 'react-redux'; 
import firebase from 'react-native-firebase';

class FCM extends React.Component {
    enableNotificationListener = () => {
        firebase.notifications().onNotification(notification => {
            const testmsg = new firebase.notifications.Notification()
            .setNotificationId(notification.notificationId)
            .setTitle(notification.title)
            .setBody(notification.body)
            firebase.notifications().displayNotification(testmsg)
        });
    }
    updateToken = (fcmToken) => {
        firebase.firestore().doc(`users/${this.props.currentUser.uid}`)
        .update({fcmToken})
    }
    componentDidMount() {
        firebase.messaging().hasPermission()
        .then(enabled => {
          if (enabled) {
            return firebase.messaging().getToken()
            .then(fcmToken => {
              if(fcmToken) {
                this.updateToken(fcmToken)
                this.enableNotificationListener(fcmToken)    
              }
            })
          } else {
            firebase.messaging().requestPermission()
            .then(() => {
              firebase.messaging().hasPermission()
              .then(enabled => {
                  if(enabled) {
                    firebase.messaging().getToken()
                    .then(fcmToken => {
                        if(fcmToken) {
                          this.updateToken(fcmToken)
                          this.enableNotificationListener(fcmToken)    
                        }
                    })
                  }
              })

            }).catch(error => console.log(error));
          }
        }).catch(error => console.error(error));
    }

    render() {
        return null
    }
}

const mapStateToProps = (state) => ({
    fcm: state.fcm,
    currentUser: state.currentUser
})
export default connect(mapStateToProps)(FCM);
