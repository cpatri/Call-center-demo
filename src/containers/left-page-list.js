import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { selectUser } from '../actions/index';


class LeftPageList extends Component {
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
