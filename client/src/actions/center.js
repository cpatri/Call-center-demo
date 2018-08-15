import { store } from '../components/layout';
export const USER_SELECTED = 'USER_SELECTED';
export const SEND_MESSAGES = 'SEND_MESSAGES';
export const UPDATE_LAST_MESSAGE = 'UPDATE_LAST_MESSAGE';
export const UPDATE_MESSAGE_LIST = 'UPDATE_MESSAGE_LIST';
export const SET_ACTIVE_USER = 'SET_ACTIVE_USER';
export const SET_CUSTOMER_INFO = 'SET_CUSTOMER_INFO';
export const UPDATE_NOTES = 'UPDATE_NOTES';
//export const SHOW_MODAL = 'SHOW_MODAL';

export function selectUser(user) {
  // selecUser is an action creator, needs to return an action
  // an object with a type property
  return {
    type: USER_SELECTED,
    payload: user,
  };
}

export function sendMessages(messageList) {
  return {
    type: SEND_MESSAGES,
    payload: messageList,
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
  };
}

export function setCustomerInfo(customerInfoList) {
  return {
    type: SET_CUSTOMER_INFO,
    payload: customerInfoList,
  };
}

export function updateNotes(notesList) {
  return {
    type: UPDATE_NOTES,
    payload: notesList,
  };
}

/*export function showModal(tf) {
  return {
    type: SHOW_MODAL,
    payload: tf,
  };
} */

const messagesRef = firebase.database().ref('messages');
messagesRef.on('value', function(snapshot) {
  store.dispatch(sendMessages(snapshot.val()));
});

const lastMessagesRef = firebase.database().ref('lastMessages');
lastMessagesRef.on('value', function(snapshot) {
  store.dispatch(updateLastMessage(snapshot.val()));
  store.dispatch(setActiveUser(Object.keys(snapshot.val())[0]))
});

const customerInfoRef = firebase.database().ref('customerInfo');
customerInfoRef.on('value', function(snapshot) {
  store.dispatch(setCustomerInfo(snapshot.val()));
});

const notesRef = firebase.database().ref('notes');
notesRef.on('value', function(snapshot) {
  store.dispatch(updateNotes(snapshot.val()));
});