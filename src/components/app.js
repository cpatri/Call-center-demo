import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Home from './home';

class App extends Component {
  render() {
    return (
      <div>
        <div>Impekable.com</div>
        <div>
          <Route exact path="/" component={Home} />
        </div>
      </div>
    );
  }
}

export default App;
