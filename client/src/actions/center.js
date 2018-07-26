export const USER_SELECTED = 'USER_SELECTED';
export const SEND_MESSAGE = 'SEND_MESSAGE';

export function selectUser(user) {
  // selecUser is an action creator, needs to return an action
  // an object with a type property
  return {
    type: USER_SELECTED,
    payload: user,
  };
}

export function sendMessage(message) {
  return {
    type: SEND_MESSAGE,
    payload: message,
  };
}
