import React, { Component } from 'react';
import ReactDOM from 'react-dom';

//import { Route } from 'react-router-dom';
//import {AppBar} from 'material-ui'
//import Home from './home';

import NavBar from '../components/nav_bar';
//class App extends Component {
//  render() {
//    return (
//      <div>
//        <div>Impekable.com</div>
//        <div>//
//        <Route exact path="/" component={Home} />
//        </div>
//      </div>
//    );
//  }
//}

class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
      </div>
    );

  }
};

export default App;
