import React, { Component } from 'react';
import GoldenLayout from 'golden-layout';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';


import { createStore, applyMiddleware } from 'redux';
import reducers from '../reducers';

import LeftPageList from '../containers/left-page-list';
import MiddlePageChat from '../containers/middle-page-chat';
import RightPageInfo from '../containers/right-page-info';

window.React = React;
window.ReactDOM = ReactDOM;

const createStoreWithMiddleWare = applyMiddleware(ReduxThunk)(createStore);

const store = createStoreWithMiddleWare(reducers);

function wrapComponent(Component, store) {
  class Wrapped extends React.Component {
    render() {
      return (
        <Provider store={store}>
          <Component {...this.props} />
        </Provider>
      );
    }
  }
  return Wrapped;
}

class GoldenLayoutWrapper extends Component {
   /* constructor(props) {
     super(props);
     this.setNode = this.setNode.bind(this);
  } */

  componentDidMount() {
    // build basic golden-layout config
    const config = {
      content: [{
        type: 'row',
        content: [
          {
            title: 'Left page',
            type: 'react-component',
            component: 'left-page-list',
          },
          {
            title: 'Middle Page',
            type: 'react-component',
            component: 'middle-page-chat',
          },
          {
            title: 'Right page',
            type: 'react-component',
            component: 'right-page-info',
          },
        ],
      }],
    };

    const layout = new GoldenLayout(config, this.layout);
    layout.registerComponent('left-page-list', wrapComponent(LeftPageList, store));
    layout.registerComponent('middle-page-chat', wrapComponent(MiddlePageChat, store));
    layout.registerComponent('right-page-info', wrapComponent(RightPageInfo, store));

    layout.init();
  }

// setNode(node) {
//   this.node = node;
// }

  render() {
    return (
      <div style={{ height: 'calc(100vh - 64px)' }} ref={input => (this.layout = input)} />
    );
  }
}

// GoldenLayoutWrapper.contextTypes = {
//   store: React.PropTypes.object.isRequired,
// };

export default GoldenLayoutWrapper;
