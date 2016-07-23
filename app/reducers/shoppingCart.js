import * as ActionType from '../actions/shoppingCart';
import Immutable from 'immutable';

let defaultState = Immutable.fromJS({
  courses: [],
})

export default function(state = defaultState, action) {
  switch(action.type) {
    case ActionType.SET_SHOPPING_CART:
      return state.set('courses', action.courses)
    default:
      return state
  }
}

