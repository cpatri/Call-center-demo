import { combineReducers } from 'redux';
// import home from './home';
import UsersReducer from './reducer_users';
import ActiveUser from './reducer_active_user';
import MessageReducer from './reducer_messages';
import CenterReducer from './center';

// how the redux state is being updated
const rootReducer = combineReducers({
  // users: UsersReducer,
  // activeUser: ActiveUser,
  // message: MessageReducer,
  center: CenterReducer,
});

export default rootReducer;
