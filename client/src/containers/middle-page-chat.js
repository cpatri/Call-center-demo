import React, { Component } from 'react';
import { connect } from 'react-redux';
import Avatar from 'material-ui/Avatar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import InputBar from '../components/input-bar';
import { selectUser } from '../actions';

const muiTheme = getMuiTheme();

class MiddlePageChat extends Component {
  componentWillMount() {
    this.props.selectUser(this.props.users[0]);
  }
  componentDidMount() {
    // console.log('this.props from middle page', this.props);
  }

  render() {
    if (!this.props.activeUser) {
      return <div />;
    }

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="messages">
          <h3> {this.props.activeUser.username} </h3>
          <br />
          <div> {this.props.activeUser.message.map(message =>
            (<div className="complete-message" key={message.text} >
              <div className="avatar-message">
                <Avatar src={this.props.activeUser.image} size={30} />
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
// Rule 1: Return an object, and I'll put all the properties and methods as props on your components
function mapStateToProps(state) {
  return state;
    // same as
    // activeUser: state.activeUser,
    // users: state.users,
}

export default connect(mapStateToProps, { selectUser })(MiddlePageChat);
