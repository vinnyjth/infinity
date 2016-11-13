import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { createStore } from 'redux'
import { Provider } from 'react-redux';
import infinityApp from './reducers/index'

import LightScheduler from './LightScheduler.js'
const store = createStore(infinityApp, window.devToolsExtension && window.devToolsExtension());
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <LightScheduler />
      </Provider>
    );
  }
}

export default App;
