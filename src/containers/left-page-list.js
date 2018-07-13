import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class LeftPageList extends Component {
  renderList() {
    return this.props.users.map(users => (
      <li key={users.username} className="list-group-item"><span> {users.username}</span></li>
      ));
  }
  render() {
    return (
      <ul className="list-group col-sm-4">
        {this.renderList()}
      </ul>
    );
  }
}

LeftPageList.PropTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  })),
};

function mapStateToProps(state) {
  return {
    users: state.users,
  };
}

export default connect(mapStateToProps)(LeftPageList);

 /* class LeftPageList extends Component {
  render() {
    return <input />;
  }
}

export default LeftPageList; */
