import { store } from '../components/layout';
export const USER_SELECTED = 'USER_SELECTED';
export const SEND_MESSAGES = 'SEND_MESSAGES';
export const UPDATE_LAST_MESSAGE = 'UPDATE_LAST_MESSAGE';
export const UPDATE_MESSAGE_LIST = 'UPDATE_MESSAGE_LIST';
export const SET_ACTIVE_USER = 'SET_ACTIVE_USER';
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

export function updateLastMessage(lastMessageList) {
  return {
    type: UPDATE_LAST_MESSAGE,
    payload: lastMessageList,
  };
}

export function setActiveUser(activeUser) {
  return {
    type: SET_ACTIVE_USER,
    payload: activeUser,
  }
}



/*const ref = firebase.database().ref('messages/' + '+17026755189');
ref.on('value', function(snapshot) {
  sendMessages(snapshot.val());
}); */

//var activeUser = store.getState().center.activeUser;
const messagesRef = firebase.database().ref('messages');
messagesRef.on('value', function(snapshot) {
  console.log('messageRef snapshot: ', snapshot.val());
  store.dispatch(sendMessages(snapshot.val()));
});

const lastMessagesRef = firebase.database().ref('lastMessages');
lastMessagesRef.on('value', function(snapshot) {
  store.dispatch(updateLastMessage(snapshot.val()));
  store.dispatch(setActiveUser(Object.keys(snapshot.val())[0]))
});