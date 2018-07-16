import React, { Component } from 'react';
import { connect } from 'react-redux';

class RightPageChat extends Component {
  render() {
    if (!this.props.user) {
      return <div className="messages"> Pick a user to see their messages. </div>;
    }

    return (
      <div className="messages">
        <h3> {this.props.user.username} </h3>
        <br />
        <div> {this.props.user.message.map(message =>
          (<div key={message}>
            {message}
            <br />
          </div>),
          )}
        </div>
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
