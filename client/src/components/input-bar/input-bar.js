import React, { PropTypes, Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import './input-bar-style.css';


class InputBar extends Component {
  constructor(props) {
    super(props);

    this.state = { message: '' };

    this.onInputChange = this.onInputChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onInputChange(event) {
    this.setState({
      message: event.target.value,
    });
  }

  onFormSubmit(event) {
    event.preventDefault();
    if (!this.state.message) {
      alert('Enter a message!');
    }
    else {
      // create an actionCreator to send the message
      this.props.sendMessage(this.state.message);
      this.setState({
        message: '',
      });
    }
  }

  render() {
    return (
      <div className="chat-input-wrap">
        <div className="chat-input-container">
          <form onSubmit={this.onFormSubmit}>
            <input
              placeholder="Type a message..."
              className="submit-message-bar"
              type="text"
              value={this.state.message}
              onChange={this.onInputChange}
            />
            <RaisedButton
              label="Send"
              primary={true}
              className="send-button"
              onClick={this.onFormSubmit}
              style={{
                position: 'relative',
                bottom: '15px',
              }}
            />
          </form>
        </div>
      </div>
    );
  }
}

InputBar.propTypes = {
  sendMessage: React.PropTypes.func,
};

export default InputBar;
