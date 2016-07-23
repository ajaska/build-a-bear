import * as ActionType from '../actions/enrolled';
import Immutable from 'immutable';

let defaultState = Immutable.fromJS({
  courses: {}
});

export default function(state = defaultState, action) {
  switch(action.type) {
    case ActionType.SET_ENROLLED_COURSES:
      return state.set('courses', action.courses)
    default:
      return state
  }
}

