// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { sayHello } from '../../actions';

// class Home extends Component {

//  static propTypes = {
//    sayHello: PropTypes.func.isRequired,
//  }

//  componentWillMount() {
//    const { sayHello } = this.props;
//    sayHello('Hello from Redux');
//  }
//  render() {
//    return (
//      <div>
//        <h1>IMPEKABLE REACT-REDUX STARTER PROJECT</h1>
//        <div>{this.props.home || 'Loading...'}</div>
//      </div>
//    );
//  }
// }

// const mapStateToProps = ({ home }) => ({ home });

// export default connect(mapStateToProps, { sayHello })(Home);
