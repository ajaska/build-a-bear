import * as ActionType from '../actions/coursePicker';
import Immutable from 'immutable';

let defaultState = Immutable.fromJS({
  ccn: "",
  sections: [],
  dept: "",
  dept_number: "",
  course_name: "",
})

export default function(state = defaultState, action) {
  switch(action.type) {
    case ActionType.SET_CCN:
      return state.set('ccn', action.ccn)
    case ActionType.SET_DEPT:
      return state.set('dept', action.dept)
    case ActionType.SET_DEPT_NUMBER:
      return state.set('dept_number', action.dept_number)
    case ActionType.SET_COURSE_NAME:
      return state.set('course_name', action.course_name)
    default:
      return state
  }
}

