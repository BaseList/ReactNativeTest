import React, {Component} from 'react';
import {StatusBar, View} from 'react-native';
import {BaseColor} from '@config';
import App from './navigation';

import {Provider} from 'react-redux';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/es/integration/react';
import configureStore from './store/ConfigureStore';
const _configureStore = configureStore();

//console.disableYellowBox = true;

export default class index extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    StatusBar.setBackgroundColor(BaseColor.primaryColor, true);
  }

  render() {
    const persistor = persistStore(_configureStore);
    return  (
      <Provider store={_configureStore}>
        <PersistGate persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    );
  }
}
