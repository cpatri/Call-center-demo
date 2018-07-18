// export * from './home';

export function selectUser(user) {
  // selecUser is an action creator, needs to return an action
  // an object with a type property
  return {
    type: 'USER_SELECTED',
    payload: user,
  };
}
