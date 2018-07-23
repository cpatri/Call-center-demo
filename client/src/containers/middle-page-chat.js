import React, { Component } from 'react';
import { connect } from 'react-redux';
import Avatar from 'material-ui/Avatar';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const muiTheme = getMuiTheme();

class MiddlePageChat extends Component {
  render() {
    if (!this.props.user) {
      return <div className="messages"> Chatbox empty. Pick a user. </div>;
    }

    return (
      <div className="messages">
        <h3> {this.props.user.username} </h3>
        <br />
        <div> {this.props.user.message.map(message =>
          (<div key={message} >
            <div className="message-bubble">
              {message}
            </div>
            <br />
          </div>),
          <br />,
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

export default connect(mapStateToProps)(MiddlePageChat);
