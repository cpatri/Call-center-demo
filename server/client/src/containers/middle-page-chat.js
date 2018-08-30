import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Paper from 'material-ui/Paper';
import InputBar from '../components/input-bar';

import { TWILIO_NUMBER } from '../config/index';

const muiTheme = getMuiTheme();

/**
 * MiddlePageChat is the container showing the chat conversation
 * the employee had with the customer. The employee can send messages
 * to the customer via the InputBar
 */

class MiddlePageChat extends Component {
  componentDidUpdate() {
    const messageListContainer = document.getElementById('container-without-input');
    if (messageListContainer) {
      messageListContainer.scrollTop = messageListContainer.scrollHeight;
    }
  }
  render() {
    const { messageListStyle,
            leftMessageBubbleStyle,
            rightMessageBubbleStyle,
            completeLeftMessageStyle,
            completeRightMessageStyle,
            headerStyle,
           } = styles;

    if (!this.props.center.activeUser) {
      return null;
    }

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div id="container-with-input">
          <Paper style={headerStyle}>
            <b>{this.props.center.activeUser} </b>
          </Paper>
          <div id="container-without-input" style={messageListStyle}>
            <br />
            <div> {Object.values(this.props.center.messages[this.props.center.activeUser]).map(
              messageInfo =>
              (<div
                style={messageInfo.number !== TWILIO_NUMBER ?
                  completeLeftMessageStyle : completeRightMessageStyle}
                key={messageInfo.message + messageInfo.timestamp}
              >
                {messageInfo.number !== TWILIO_NUMBER ? <div className="avatar-message">
                  <Avatar src={`https://api.adorable.io/avatars/255/${messageInfo.number}@adorable.png`} size={30} />
                </div> : null }
                <div style={messageInfo.number !== TWILIO_NUMBER ?
                  leftMessageBubbleStyle :
                  rightMessageBubbleStyle}
                >
                  {messageInfo.message}
                  <br />
                </div>
              </div>),
              <br />,
              )}
            </div>
          </div>
          <InputBar />
        </div>
      </MuiThemeProvider>
    );
  }
}
const messagesShape = {
  message: PropTypes.string,
  number: PropTypes.string,
  timestamp: PropTypes.number,
};

MiddlePageChat.propTypes = {
  center: PropTypes.shape({
    activeUser: PropTypes.string,
    customerInfo: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
    lastMessages: PropTypes.objectOf(PropTypes.shape(messagesShape)),
    message: PropTypes.string,
    messages: PropTypes.objectOf(PropTypes.objectOf(PropTypes.shape(messagesShape))),
    notes: PropTypes.objectOf(PropTypes.shape({ notes: PropTypes.string })),
  }),
};

MiddlePageChat.defaultProps = {
  center: {},
};

// Rule 1: Return an object, and I'll put all the properties and methods as props on your components
function mapStateToProps(state) {
  return state;
    // same as
    // activeUser: state.activeUser,
    // users: state.users,
}

const styles = {
  headerStyle: {
    textAlign: 'center',
    height: '46px',
    verticalAlign: 'middle',
    lineHeight: '46px',
  },
  messageListStyle: {
    position: 'relative',
    height: '100vh',
    overflowY: 'scroll',
    paddingBottom: '170px',
  },
  completeLeftMessageStyle: {
    display: 'flex',
    padding: '10px',
    color: 'black',
  },
  completeRightMessageStyle: {
    display: 'flex',
    flexDirection: 'row-reverse',
    padding: '10px',
    color: 'white',
  },
  leftMessageBubbleStyle: {
    background: '#fff',
    padding: '0.5em 0.9em 0.5em 0.9em',
    borderRadius: '20px',
    fontSize: '0.8em',
    marginBottom: '1.1em',
    marginLeft: '1.1em',
    lineHeight: '1.5em',
    fontFamily: 'Roboto, sans-serif',
  },
  rightMessageBubbleStyle: {
    background: '#00BCD4',
    padding: '0.5em 0.9em 0.5em 0.9em',
    borderRadius: '20px',
    fontSize: '0.8em',
    marginBottom: '1.1em',
    marginLeft: '1.1em',
    lineHeight: '1.5em',
    fontFamily: 'Roboto, sans-serif',
  },
};

export default connect(mapStateToProps)(MiddlePageChat);
