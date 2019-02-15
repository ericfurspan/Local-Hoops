import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './app/reducer';
import { composeWithDevTools } from 'redux-devtools-extension';

const composeEnhancers = composeWithDevTools({ realtime: true });

const store = createStore(reducer,
    composeEnhancers(applyMiddleware(thunk))
);

export default store;