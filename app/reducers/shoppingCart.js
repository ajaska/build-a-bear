import * as ActionType from '../actions/shoppingCart';
import * as APIActionType from '../actions/api';
import Immutable from 'immutable';

let defaultState = Immutable.fromJS({
  courses: [],
})

export default function(state = defaultState, action) {
  switch(action.type) {
    case ActionType.SET_SHOPPING_CART:
      return state.set('courses', action.courses)
    case APIActionType.RECEIVE_COURSE_ADD:
      return state.set('courses', action.courses)
    default:
      return state
  }
}

