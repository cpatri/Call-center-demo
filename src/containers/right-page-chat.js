import React, { Component } from 'react';
import { connect } from 'react-redux';

class RightPageChat extends Component {
  render() {
    if (!this.props.user) {
      return <div><span> Pick a user to see their messages. </span></div>;
    }

    return (
      <div>
        <span>
          <h3> Messages from {this.props.user.username}: </h3>
          <h4> {this.props.user.message.map(message =>
            <li> {message} </li>,
          )}
          </h4>
        </span>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    user: state.activeUser,
  };
}

export default connect(mapStateToProps)(RightPageChat);
