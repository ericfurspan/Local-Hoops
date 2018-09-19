import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import devToolsEnhancer from 'remote-redux-devtools';

const composeEnhancers = composeWithDevTools({ realtime: true });

const store = createStore(reducer,
    composeEnhancers(applyMiddleware(thunk))
);

export default store;