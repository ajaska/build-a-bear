import { combineReducers } from 'redux';
import coursePicker from './coursePicker';
import enrolled from './enrolled';
import shoppingCart from './shoppingCart';

const rootReducer = combineReducers({
  coursePicker,
  enrolled,
  shoppingCart,
});

export default rootReducer;
