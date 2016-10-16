import { combineReducers } from 'redux';
import api from './api';
import coursePicker from './coursePicker';
import enrolled from './enrolled';
import semester from './semester';
import shoppingCart from './shoppingCart';

const rootReducer = combineReducers({
  api,
  coursePicker,
  enrolled,
  semester,
  shoppingCart,
});

export default rootReducer;
