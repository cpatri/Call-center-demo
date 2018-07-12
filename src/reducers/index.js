import { combineReducers } from 'redux';
// import home from './home';
import UsersReducer from './reducer_users';

const rootReducer = combineReducers({
  users: UsersReducer,
});

export default rootReducer;
