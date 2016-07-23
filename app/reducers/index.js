import { combineReducers } from 'redux';
import enrolled from './enrolled';
import shoppingCart from './shoppingCart';

const rootReducer = combineReducers({
  enrolled,
  shoppingCart,
});

export default rootReducer;
