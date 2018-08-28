
import React from 'react';
import { Provider } from 'react-redux';

export default function wrapComponent(Component, store) {
  // eslint-disable-next-line react/prefer-stateless-function
  class Wrapped extends React.Component {
    render() {
      return (
        <Provider store={store}>
          <Component {...this.props} />
        </Provider>
      );
    }
  }
  return Wrapped;
}
