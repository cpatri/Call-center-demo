import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class LeftPageList extends Component {

  renderList() {
    if (!this.props.users) {
      return null;
    }
    return this.props.users.map(users => (
      <li key={users.username} className="list-group-item"> {users.username} </li>
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

function mapStateToProps(state) {
  console.log(state)
  return {
    users: state.users,
  };
}

LeftPageList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  })).isRequired,
};

export default connect(mapStateToProps)(LeftPageList);
