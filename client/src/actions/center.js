export const USER_SELECTED = 'USER_SELECTED';
export const SEND_MESSAGES = 'SEND_MESSAGES';

export function selectUser(user) {
  // selecUser is an action creator, needs to return an action
  // an object with a type property
  return {
    type: USER_SELECTED,
    payload: user,
  };
}

export function sendMessages(message) {
  return {
    type: SEND_MESSAGES,
    payload: message,
  };
} 



var ref = firebase.database().ref('messages/' + '+17026755189');
ref.on('value', function(snapshot) {
  sendMessages(snapshot.val());
});