import { combineReducers } from 'redux';
// import home from './home';
import CenterReducer from './center';

// how the redux state is being updated
const rootReducer = combineReducers({
  center: CenterReducer,
});

export default rootReducer;
