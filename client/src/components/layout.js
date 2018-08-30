import React, { Component } from 'react';
import GoldenLayout from 'golden-layout';
import ReactDOM from 'react-dom';
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

/**
 * GoldenLayoutWrapper is the GoldenLayout component
 * that displays 3 other components and renders them left to right:
 * LeftPageList: the component that shows the list of customers to talk to
 * MiddlePageChat: the component that enables the call center employee to chat
 * with the customer
 * RightPageInfo: the component that shows the customer's available info and enables
 * the call center employee to call the customer directly and take notes of the conversation
 */

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

    // GoldenLayout breaks the redux store by default so the components must be wrapped
    // with the store
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
