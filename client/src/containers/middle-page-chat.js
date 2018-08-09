import React, { Component } from 'react';
import { connect } from 'react-redux';
import Avatar from 'material-ui/Avatar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import InputBar from '../components/input-bar';
import { selectUser } from '../actions';
import { TWILIO_NUMBER } from '../config/index';

const muiTheme = getMuiTheme();

class MiddlePageChat extends Component {
  componentWillMount() {
    
    this.props.selectUser(Object.keys(this.props.center.messages)[0]);
    
  }

  render() {
    console.log('middle page chat render called');
    const { messageListStyle,
            leftMessageBubbleStyle,
            rightMessageBubbleStyle,
            completeLeftMessageStyle,
            completeRightMessageStyle } = styles;
    
    if (!this.props.center.activeUser) {
      return <div />;
    }
    //console.log(this.props.center.activeUser);
    //gives the children of 
    /*return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={messageListStyle}>
          <h3 > {this.props.center.activeUser.username} </h3>
          <br />
          <div> {this.props.center.activeUser.message.map(message =>
            (<div
              style={message.id === 0 ? completeLeftMessageStyle : completeRightMessageStyle}
              key={message.text}
            >
              {!message.id && <div className="avatar-message">
                <Avatar src={this.props.center.activeUser.image} size={30} />
              </div>}
              <div style={message.id === 0 ? leftMessageBubbleStyle : rightMessageBubbleStyle}>
                {message.text}
                <br />
              </div>
              <br />
            </div>),
            <br />,
            )}
          </div>
          <InputBar />
        </div>
      </MuiThemeProvider>
    ); */
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={messageListStyle}>
          <h3> {this.props.center.activeUser} </h3> 
          <br />
          <div> {Object.values(this.props.center.messages[this.props.center.activeUser]).map((messageInfo)=> 
            (<div 
                style={messageInfo.number != TWILIO_NUMBER ? completeLeftMessageStyle : completeRightMessageStyle}
                key = {messageInfo.message}
              >
                {messageInfo.number != TWILIO_NUMBER ?  <div className="avatar-message">
                  <Avatar src={`https://api.adorable.io/avatars/255/${messageInfo.number}@adorable.png`} size={30} />
                </div> : null }
                <div style={messageInfo.number != TWILIO_NUMBER? leftMessageBubbleStyle : rightMessageBubbleStyle}>
                  {messageInfo.message}
                  <br />
                </div>
            </div>),
            <br />,
            )}
          </div>
            <InputBar />
        </div>
      </MuiThemeProvider>
    );
  }
}

// Rule 1: Return an object, and I'll put all the properties and methods as props on your components
function mapStateToProps(state) {
  return state;
    // same as
    // activeUser: state.activeUser,
    // users: state.users,
}

const styles = {
  messageListStyle: {
    position: 'relative',
    height: '100%',
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

export default connect(mapStateToProps, { selectUser })(MiddlePageChat);
