// AUTH
import { 
    LOGIN_REQUEST, 
    LOGIN_SUCCESS, 
    LOGIN_ERROR, 
    LOGOUT
} from './actions/Auth';
//USER
import { 
    UPDATE_USERLOC,
    UPDATE_STATUS,
    UPDATE_FRIENDS,
    ADD_FRIEND_REQUEST,
    ADD_FRIEND_SUCCESS,
    ADD_FRIEND_ERROR,
    REMOVE_FRIEND_REQUEST,
    REMOVE_FRIEND_SUCCESS,
    REMOVE_FRIEND_ERROR 
} from './actions/User';
// EVENTS
import { 
    UPDATE_EVENTS,
    UPDATE_TEMPEVENT,
    UPDATE_TEMPEVENT_FRIENDS,
    UPDATE_TEMPEVENT_TYPE,
    SAVE_EVENT_REQUEST,
    SAVE_EVENT_SUCCESS,
    SAVE_EVENT_ERROR,
    DELETE_EVENT_REQUEST,
    DELETE_EVENT_SUCCESS,
    DELETE_EVENT_ERROR,
    CLEAR_TEMP_EVENT
} from './actions/Event';
import { eventTypes } from '../app/components/CreateEvent/EventForm';
// COURT
/*import { 
    SAVE_COURT, 
    SAVE_COURT_SUCCESS 
} from './actions/Court';
*/
// FIREBASE MESSAGING
//import {  } from './actions/Messaging';

// MISC
import { 
    CLEAR_ERROR,
    RENDER_NOTIFICATION,
    CLEAR_NOTIFICATION
} from './actions/Misc';

const initialState = {
    currentUser: null,
    events: null,
    tempEvent: {
        step: 1,
        type: eventTypes[0],
        date: new Date()
    },
    friends: null,
    loggedIn: false,
    authLoading: false,
    loading: false,
    notification: null,
    error: null
};

const reducer = (state = initialState, action) => {
    if (action.type === LOGIN_REQUEST) {
        return Object.assign({}, state, {
            error: null,
            authLoading: true
        });
    } else if (action.type === LOGIN_SUCCESS) {
        return Object.assign({}, state, {
            currentUser: action.user,
            loggedIn: true,
            authLoading: false,
            error: null
        });
    } else if (action.type === LOGIN_ERROR) {
        return Object.assign({}, state, {
            error: action.message,
            authLoading: false
        });
    } else if (action.type === LOGOUT) {
        return Object.assign({}, state, {
            currentUser: null,
            events: null,
            loggedIn: false,
            friends: null,
            authLoading: false
        });   
    } else if(action.type === UPDATE_STATUS) {
        return Object.assign({}, state, {
            currentUser: {
                ...state.currentUser,
                status: action.status
            }
        });
    } else if (action.type === UPDATE_EVENTS) {
         switch(action.category) {
                case 'user':
                    return Object.assign({}, state, {
                        events: {
                            ...state.events,
                            user: action.events
                        }
                    });
                case 'friends':
                    return Object.assign({}, state, {
                        events: {
                            ...state.events,
                            friends: action.events
                        }
                    });
                case 'all':
                    return Object.assign({}, state, {
                        events: {
                            ...state.events,
                            all: [...state.events.user, ...state.events.friends]
                        }
                    });
         }
    } else if (action.type === UPDATE_TEMPEVENT_FRIENDS) {
        return Object.assign({}, state, {
            tempEvent: {
                ...state.tempEvent,
                friends: action.friends
            }
        })
    } else if (action.type === UPDATE_TEMPEVENT_TYPE) {
        return Object.assign({}, state, {
            tempEvent: {
                ...state.tempEvent,
                type: action.data
            }
        })
    } else if (action.type === UPDATE_TEMPEVENT) {
        if(typeof action.data !== 'object' || action.field == 'date') {
            return Object.assign({}, state, {
                tempEvent: {
                    ...state.tempEvent,
                    [action.field]: action.data
                }
            })
        } else {
            return Object.assign({}, state, {
                tempEvent: {
                    ...state.tempEvent,
                    [action.field]: {
                        ...state.tempEvent[action.field],
                        ...action.data
                    }
                }
            })
        }
    } else if (action.type === CLEAR_TEMP_EVENT) {
        return Object.assign({}, state, {
            tempEvent: initialState.tempEvent
        });
    } else if (action.type === UPDATE_USERLOC) {
        return Object.assign({}, state, {
            currentUser: {
                ...state.currentUser,
                location: action.userLoc
            }
        });
    } else if (action.type === UPDATE_FRIENDS) {
        let friends = state.friends ? state.friends.filter(f => f.uid !== action.friend.uid) : [];
        friends.push(action.friend);
        const friendIds = friends.map(f=>f.uid);
        return Object.assign({}, state, {
            friends,
            currentUser: {
                ...state.currentUser,
                friends: friendIds
            }
        });
    } else if (action.type === ADD_FRIEND_REQUEST) {
        return Object.assign({}, state, {   
            loading: true
        });
    } else if (action.type === ADD_FRIEND_SUCCESS) {
        return Object.assign({}, state, {
            currentUser: {
                ...state.currentUser,
                friends: state.currentUser.friends ? [...state.currentUser.friends, action.friendId] : [action.friendId]
            },
            error: null,
            loading: false
        });
    } else if (action.type === ADD_FRIEND_ERROR) {
        return Object.assign({}, state, {
            error: action.error.message
        });
    } else if (action.type === REMOVE_FRIEND_REQUEST) {
        return Object.assign({}, state, {
            loading: true
        });        
    } else if (action.type === REMOVE_FRIEND_SUCCESS) {
        return Object.assign({}, state, {
            currentUser: {
                ...state.currentUser,
                friends: state.currentUser.friends.filter(id => id !== action.friendId)
            },
            friends: state.friends ? state.friends.filter(f => f.uid != action.friendId) : [],
            error: null,
            loading: false
        });
    } else if (action.type === REMOVE_FRIEND_ERROR) {
        return Object.assign({}, state, {
            error: action.error.message
        });
    } else if (action.type === CLEAR_ERROR) {
        return Object.assign({}, state, {
            error: null,
        });
    } else if (action.type === RENDER_NOTIFICATION) {
        return Object.assign({}, state, {
            notification: action.notification,
        });
    } else if (action.type === CLEAR_NOTIFICATION) {
        return Object.assign({}, state, {
            notification: null,
        });
    } else if (action.type === SAVE_EVENT_REQUEST) {
        return Object.assign({}, state, {
            loading: true,
        });        
    } else if (action.type === SAVE_EVENT_SUCCESS) {
        return Object.assign({}, state, {
            loading: false
        });        
    } else if (action.type === SAVE_EVENT_ERROR) {
        return Object.assign({}, state, {
            loading: false,
            error: action.error
        });        
    } else if (action.type === DELETE_EVENT_REQUEST) {
        return Object.assign({}, state, {
            loading: true,
        });        
    } else if (action.type === DELETE_EVENT_SUCCESS) {
        return Object.assign({}, state, {
            loading: false,
            events: {
                user: state.events.user ? state.events.user.filter(e => e.id != action.eventId) : null,
                friends: state.events.friends ? state.events.friends.filter(e => e.id != action.eventId) : null
            }
        });        
    } else if (action.type === DELETE_EVENT_ERROR) {
        return Object.assign({}, state, {
            loading: false,
            error: action.error
        });        
    }
    return state;
}

export default reducer;