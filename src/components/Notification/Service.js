import PushNotification from 'react-native-push-notification';

export default class Service {
  constructor(onRegister, onNotification) {
    this.configure(onRegister, onNotification);

    this.lastId = 0;
  }

  configure(onRegister, onNotification, gcm = '') {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister, // this._onRegister.bind(this),

      // (required) Called when a remote or local notification is opened or received
      onNotification, // this._onNotification,

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically (default: true)
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: true,
    });
  }

  localNotif() {
    this.lastId++;
    PushNotification.localNotification({
      title: 'Local Notification', // (optional)
      message: 'My Notification Message', // (required)
      playSound: false, // (optional) default: true
      soundName: 'default',
      number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      alertAction: 'view',
      category: null,
      userInfo: null, // (optional) default: null (object containing additional notification data)
    });
  }

  scheduleNotif() {
    this.lastId++;
    PushNotification.localNotificationSchedule({
      title: 'Scheduled Notification', // (optional)
      message: 'My Notification Message', // (required)
      playSound: true, // (optional) default: true
      soundName: 'default',
      date: new Date(Date.now() + 30 * 1000), // in 30 secs
      alertAction: 'view', // (optional) default: view
      category: null, // (optional) default: null
      userInfo: null, // (optional) default: null (object containing additional notification data)
    });
  }

  checkPermission(cbk) {
    return PushNotification.checkPermissions(cbk);
  }

  cancelNotif() {
    PushNotification.cancelLocalNotifications({ id: `${this.lastId}` });
  }

  cancelAll() {
    PushNotification.cancelAllLocalNotifications();
  }
}
