
import React from 'react';
import { Provider } from 'react-redux';

/**
 * wrapComponent is a function needed in the GoldenLayoutWrapper component to
 * pass in the redux store to the components that will be rendered in GoldenLayout
 */

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
