import React, { Component } from 'react';
import { connect } from 'react-redux';
import ChatBubble from 'react-chat-bubble';

/*class MiddlePageChat extends Component {
  render() {
    if (!this.props.user) {
      return <div className="messages"> Chatbox empty. Pick a user. </div>;
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
} */


let listObject = [{
  type: 0,
  image: 'https://vignette.wikia.nocookie.net/harrypotter/images/b/ba/Harry-Potter-1-.jpg/revision/latest?cb=20090725202753',
  text: 'Hello! Good Morning!',
}, {
  type: 1,
  image: 'https://78.media.tumblr.com/6f3d171e49124b15429a8fb6b556b861/tumblr_p1dzfudWbF1vcmbt9o1_400.png',
  text: 'Hello! Good Afternoon!',
}];

class MiddlePageChat extends Component {
  render() {
    return (
      <ChatBubble messages={listObject} />
    );
  }
}
/*class MiddlePageChat extends Component {
  render() {
    if (!this.props.user) {
      return <div className="messages"> Chatbox empty. Pick a user. </div>;
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
} */

function mapStateToProps(state) {
  return {
    user: state.activeUser,
  };
}

export default connect(mapStateToProps)(MiddlePageChat);
