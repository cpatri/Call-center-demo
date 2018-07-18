import {
  SAY_HELLO,
} from '../actions/types';

export default (state = null, action) => {
  switch (action.type) {
    case SAY_HELLO:
      return action.payload;
    default:
      return state;
  }
};
