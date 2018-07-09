import { SAY_HELLO } from './types';

export const sayHello = message => (dispatch) => {
  dispatch({
    type: SAY_HELLO,
    payload: message,
  });
};
