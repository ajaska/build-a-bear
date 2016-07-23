import { combineReducers } from 'redux';
import api from './api';
import coursePicker from './coursePicker';
import enrolled from './enrolled';
import shoppingCart from './shoppingCart';

const rootReducer = combineReducers({
  api,
  coursePicker,
  enrolled,
  shoppingCart,
});

export default rootReducer;
