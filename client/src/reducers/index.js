import { combineReducers } from 'redux';
import CenterReducer from './center';

// how the redux state is being updated
// it takes what's returned from the reducer and maps it to center
const rootReducer = combineReducers({
  center: CenterReducer,
});

export default rootReducer;
