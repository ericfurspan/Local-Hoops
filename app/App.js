import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { AppContainer } from './navigation';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}
