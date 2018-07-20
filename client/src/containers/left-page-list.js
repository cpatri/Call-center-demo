import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Menu from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { selectUser } from '../actions/index';

const muiTheme = getMuiTheme(darkBaseTheme);

/*class LeftPageList extends Component {
  renderList() {
    return this.props.users.map(user => (
      <div
        onClick={() => this.props.selectUser(user)}
        className="username-list-item"
        key={user.username}
      >
        <li
          className="username-item"
          key={user.username}
        >
          {user.username}
        </li>
      </div>
    ));
  }

  render() {
    return (
      <ul className="list-group">
        {this.renderList()}
      </ul>
    );
  }

}*/
class LeftPageList extends Component {
  renderList() {
    return this.props.users.map(user => (
      <MenuItem key={user.username} primaryText={user.username} onClick={() => this.props.selectUser(user)} />
    ));
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Paper>
          <Menu>
            {this.renderList()}
          </Menu>
        </Paper>
      </MuiThemeProvider>
    );
  }
}

LeftPageList.PropTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  })).isRequired,
};

function mapStateToProps(state) {
  return {
    users: state.users,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ selectUser }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftPageList);

 /* class LeftPageList extends Component {
  render() {
    return <input />;
  }
}

export default LeftPageList; */
