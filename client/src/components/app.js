import React, { Component } from 'react';
import Modal from './modal';

// import { Route } from 'react-router-dom';
// import {AppBar} from 'material-ui'
// import Home from './home';

import NavBar from '../components/nav_bar';

class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <div>
          <Modal>
            <h1> Hi! </h1>
          </Modal>
        </div>
      </div>

    );
  }
}

export default App;
