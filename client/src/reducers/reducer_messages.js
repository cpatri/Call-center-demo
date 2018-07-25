import { SEND_MESSAGE } from '../actions';

export default function (state = [], action) {

  switch(action.type) {
    case SEND_MESSAGE:
      console.log('SEND MESSAGE WAS CALLED ');
      return state;
  }
  return state;
}
