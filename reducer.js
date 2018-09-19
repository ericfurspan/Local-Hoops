import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    LOGOUT,
    UPDATE_EVENTS,
    UPDATE_EVENTS_REQUEST
} from './actions/auth';

const initialState = {
    currentUser: null,
    events: null,
    loggedIn: false,
    loading: false,
    error: null
};

export default reducer = (state = initialState, action)  => {
    if (action.type === LOGIN_REQUEST) {
        return Object.assign({}, state, {
            error: null
        });
    } else if (action.type === LOGIN_SUCCESS) {
        return Object.assign({}, state, {
            currentUser: action.user,
            loggedIn: true,
            error: null
        });
    } else if (action.type === LOGIN_ERROR) {
        return Object.assign({}, state, {
            error: action.error.message
        });
    } else if (action.type === LOGOUT) {
        return Object.assign({}, state, {
            currentUser: null,
            loggedIn: false
        });
    } else if (action.type === UPDATE_EVENTS_REQUEST) {
        return Object.assign({}, state, {
            loading: true
        });   
    } else if (action.type === UPDATE_EVENTS) {
         console.log(action.events)
         console.log(action.category)
         switch(action.category) {
                case 'user':
                    return Object.assign({}, state, {
                        events: {
                            ...state.events,
                            user: action.events
                        }
                    });
                    break;
                case 'friends':
                    console.log(state)
                    console.log(action.events)
                    return Object.assign({}, state, {
                        events: {
                            ...state.events,
                            friends: action.events
                        }
                    });
                    break;
                case 'all':
                    console.log([...state.events.user, ...state.events.friends])
                    return Object.assign({}, state, {
                        events: {
                            ...state.events,
                            all: [...state.events.user, ...state.events.friends]
                        }
                    });
                    break;
         }

    }
    return state;
}
