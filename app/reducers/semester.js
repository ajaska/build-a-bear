import * as ActionType from '../actions/semester';
import * as APIActionType from '../actions/api';
import Immutable from 'immutable';

const defaultState = Immutable.fromJS({
  career: '',
  term: '',
  choices: [],
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case ActionType.SET_SEMESTER:
    case APIActionType.RECEIVE_SEMESTER_CHANGE:
      return state.set('career', action.career)
                  .set('term', action.term);
    case ActionType.SET_SEMESTER_CHOICES:
    case APIActionType.RECEIVE_SEMESTER_CHOICES:
      return state.set('choices', action.choices);
    default:
      return state;
  }
}
    /* case APIActionType.RECEIVE_COURSE_ADD:
    case APIActionType.RECEIVE_CART_DROP:
      return state.set('courses', action.shoppingCartCourses); */
