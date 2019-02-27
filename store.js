import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './app/reducer';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';

const composeEnhancers = composeWithDevTools({ realtime: true });


const store = createStore(reducer,
  composeEnhancers(applyMiddleware(
    thunk,
    logger // must be last
  ))
);

export default store;