import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { selectUser } from '../actions/index';
import { TWILIO_NUMBER } from '../config/index';

const muiTheme = getMuiTheme();

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
  return class SelectableList extends Component {
    static propTypes = {
      children: PropTypes.node.isRequired,
      defaultValue: PropTypes.number.isRequired,
    };

    componentWillMount() {
      this.setState({
        selectedIndex: this.props.defaultValue,
      });
    }

    handleRequestChange = (event, index) => {
      this.setState({
        selectedIndex: index,
      });
    };

    render() {
      return (
        <ComposedComponent
          value={this.state.selectedIndex}
          onChange={this.handleRequestChange}
        >
          {this.props.children}
        </ComposedComponent>
      );
    }
  };
}

SelectableList = wrapState(SelectableList);

class LeftPageList extends Component {
  componentDidMount() {
    ListItem.defaultProps.disableTouchRipple = true;
    ListItem.defaultProps.disableFocusRipple = true;
  }
  renderList() {
    /*return this.props.messages.map((user, index) => (
      <ListItem
        value={index}
        leftAvatar={
          <Avatar
            src={user.image}
            size={30}
          />
        }
        key={user.username}
        primaryText={user.username}
        secondaryText={
          user.message[user.message.length - 1].id === 0 ?
          user.message[user.message.length - 1].text :
          `You: ${user.message[user.message.length - 1].text}`}
        secondaryTextLines={2}
        onClick={() => this.props.selectUser(user)}
      />
    )); */
    return Object.keys(this.props.messages).map((phoneNum, index) => (
      <ListItem
        value={index}
        leftAvatar={
          <Avatar 
            src={`https://api.adorable.io/avatars/255/${phoneNum}@adorable.png`}
            size={30}
          />
        }
        key={phoneNum}
        primaryText={phoneNum}
        secondaryText= {this.props.lastMessages[phoneNum].message}
        secondaryTextLines={2}
        onClick={() => this.props.selectUser(phoneNum)}
      />    
    ));

  

  }
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Paper>
          <SelectableList defaultValue={0}>
            {this.renderList()}
          </SelectableList>
        </Paper>
      </MuiThemeProvider>
    );
  }
}

LeftPageList.PropTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  })).isRequired,
};

function mapStateToProps(state) {
  return {
    messages: state.center.messages,
    lastMessages: state.center.lastMessages,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ selectUser }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftPageList);
