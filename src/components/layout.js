import React, { Component } from 'react';
import GoldenLayout from 'golden-layout';
import ReactDOM from 'react-dom';
import LeftPageList from './left-page-list';
import RightPageChat from './right-page-chat';

window.React = React;
window.ReactDOM = ReactDOM;

class Layout extends Component {
  constructor(props) {
    super(props);
    this.setNode = this.setNode.bind(this);
  }

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
            title: 'Right Page',
            type: 'react-component',
            component: 'right-page-chat',
          },
        ],
      }],
    };

    const myLayout = new GoldenLayout(config, this.node);
    myLayout.registerComponent('left-page-list', LeftPageList);
    myLayout.registerComponent('right-page-chat', RightPageChat);
    myLayout.init();
  }

  setNode(node) {
    this.node = node;
  }

  render() {
    return (
      <div style={{ height: 'calc(100vh - 64px)' }} ref={this.setNode} />
    );
  }
}


export default Layout;
