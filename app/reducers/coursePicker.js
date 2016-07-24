import * as ActionType from '../actions/coursePicker';
import * as APIActionType from '../actions/api';
import Immutable from 'immutable';

let defaultState = Immutable.fromJS({
  ccn: "",
  sections: [],
  loading_sections: false,
  dept: "",
  dept_number: "",
  course_name: "",
  selection: "0",
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
    case ActionType.CLEAR_SECTIONS:
      return state.set('sections', Immutable.fromJS([]))
    case ActionType.SET_SELECTION:
      return state.set('selection', action.selection)
    case APIActionType.REQUEST_SECTIONS:
      return state.set('loading_sections', true)
    case APIActionType.RECEIVE_SECTIONS:
      if (state.get('ccn') === action.ccn) {
        return state.set('sections', Immutable.fromJS(action.sections))
                    .set('loading_sections', false)
      }
      return state
    default:
      return state
  }
}

