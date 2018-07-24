import React, { Component } from 'react';
import { connect } from 'react-redux';
import InputBar from '../components/input-bar/input-bar';
import Avatar from 'material-ui/Avatar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { selectUser } from '../actions';

const muiTheme = getMuiTheme();

class MiddlePageChat extends Component {
  componentWillMount() {
    // this.props.selectUser({});
    // console.log(this.props);
  }

  render() {
    if (!this.props.user) {
      return <div className="messages"> Chatbox empty. Pick a user. </div>;
    }

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="messages">
          <h3> {this.props.user.username} </h3>
          <br />
          <div> {this.props.user.message.map(message =>
            (<div className="complete-message" key={message.text} >
              <div className="avatar-message">
                <Avatar src={this.props.user.image} size={30} />
              </div>
              <div className="message-bubble">
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
    );
  }
}


function mapStateToProps(state) {
  return {
    user: state.activeUser,
  };
}

export default connect(mapStateToProps)(MiddlePageChat);
