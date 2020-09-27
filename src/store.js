import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'remote-redux-devtools';
import reducer from './reducer';

const middleware = [thunk];

const composeEnhancers = composeWithDevTools({ realtime: true, collapsed: true });
const store = createStore(reducer, {}, composeEnhancers(
  applyMiddleware(...middleware),
));

export default store;
