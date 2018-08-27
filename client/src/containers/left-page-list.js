import React, { Component } from 'react';
import { connect } from 'react-redux';
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
    if (!this.props.lastMessages) {
      return null;
    }
    return Object.keys(this.props.lastMessages).map((phoneNum, index) => (
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
        secondaryText={this.props.lastMessages[phoneNum].number === TWILIO_NUMBER ?
          `You: ${this.props.lastMessages[phoneNum].message}` : this.props.lastMessages[phoneNum].message}
        secondaryTextLines={2}
        onClick={() => this.props.selectUser(phoneNum)}
      />
    ));
  }
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Paper style={{ maxHeight: '100vh', overflow: 'auto' }}>
          <SelectableList defaultValue={0} >
            {this.renderList()}
          </SelectableList>
        </Paper>
      </MuiThemeProvider>
    );
  }
}

const messagesShape = {
  message: PropTypes.string,
  number: PropTypes.string,
  timestamp: PropTypes.number,
};

LeftPageList.propTypes = {
  lastMessages: PropTypes.shape(messagesShape),
  selectUser: PropTypes.func,
};

LeftPageList.defaultProps = {
  lastMessages: {},
  selectUser: () => {},
};

function mapStateToProps(state) {
  return {
    lastMessages: state.center.lastMessages,
  };
}

export default connect(mapStateToProps, { selectUser })(LeftPageList);
