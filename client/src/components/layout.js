import React, { Component } from 'react';
import GoldenLayout from 'golden-layout';
import ReactDOM from 'react-dom';
// import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import ReduxPromise from 'redux-promise';
// import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import reducers from '../reducers';

import LeftPageList from '../containers/left-page-list';
import MiddlePageChat from '../containers/middle-page-chat';
import RightPageInfo from '../containers/right-page-info';
import wrapComponent from './wrap-component';

window.React = React;
window.ReactDOM = ReactDOM;

const createStoreWithMiddleWare = applyMiddleware(ReduxThunk, ReduxPromise)(createStore);
// applyMiddleware(ReduxThunk, ReduxPromise, createLogger())(createStore);

export const store = createStoreWithMiddleWare(reducers);

class GoldenLayoutWrapper extends Component {
  componentDidMount() {
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
    $(window).resize(() => {
      layout.updateSize();
    });
  }
  render() {
    const styles = {
      wrapperStyle: {
        width: '100%',
        height: 'calc(100vh - 64px)',
      },
    };
    const { wrapperStyle } = styles;
    return (
      <div id="golden-layout-wrapper" style={wrapperStyle} ref={(input) => { this.layout = input; }} />
    );
  }
}

export default GoldenLayoutWrapper;
