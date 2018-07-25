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
    this.props.selectUser(this.props.center.users[0]);
  }

  render() {
    const { messageBubbleStyle } = styles;
    if (!this.props.center.activeUser) {
      return <div />;
    }

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="messages">
          <h3 > {this.props.center.activeUser.username} </h3>
          <br />
          <div> {this.props.center.activeUser.message.map(message =>
            (<div className="complete-message" key={message.text} >
              <div className="avatar-message">
                <Avatar src={this.props.center.activeUser.image} size={30} />
              </div>
              <div style={ messageBubbleStyle }>
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

const styles = {
  messageBubbleStyle: {
    background: '#fff',
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
