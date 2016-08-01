import * as ActionType from '../actions/enrolled';
import * as APIActionType from '../actions/api';
import Immutable from 'immutable';

const defaultState = Immutable.fromJS({
  courses: [],
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case ActionType.SET_ENROLLED_COURSES:
      return state.set('courses', action.courses);
    case APIActionType.RECEIVE_COURSE_ADD:
    case APIActionType.RECEIVE_CART_DROP:
      return state.set('courses', action.enrolledCourses);
    default:
      return state;
  }
}

