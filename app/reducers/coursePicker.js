import * as ActionType from '../actions/coursePicker';
import * as APIActionType from '../actions/api';
import Immutable from 'immutable';

let defaultState = Immutable.fromJS({
  ccn: "",
  sections: [],
  loading_sections: false,
  dept: "",
  dept_options: [],
  dept_number: "",
  dept_numbers: [],
  course_name: "",
  selection: "0",
})

export default function(state = defaultState, action) {
  switch(action.type) {
    case ActionType.SET_CCN:
      return state.set('ccn', action.ccn)
    case ActionType.SET_DEPT:
      return state.set('dept', action.dept)
    case ActionType.SET_DEPT_OPTIONS:
      return state.set('dept_options', action.dept_options)
    case ActionType.SET_DEPT_NUMBER:
      return state.set('dept_number', action.dept_number)
    case ActionType.SET_DEPT_NUMBERS:
      return state.set('dept_numbers', Immutable.fromJS(action.dept_numbers))
    case ActionType.CLEAR_CCN:
      return state.set('ccn', defaultState.get('ccn'))
    case ActionType.CLEAR_DEPT:
      return state.set('dept', defaultState.get('dept'))
                  .set('dept_options', defaultState.get('dept_options'))
                  .set('dept_number', defaultState.get('dept_number'))
                  .set('dept_numbers', defaultState.get('dept_numbers'))
    case ActionType.SET_COURSE_NAME:
      return state.set('course_name', action.course_name)
    case ActionType.CLEAR_COURSE:
      return state.set('course_name', defaultState.get('course_name'))
    case ActionType.CLEAR_SECTIONS:
      return state.set('sections', defaultState.get('sections'))
                  .set('selection', defaultState.get('selection'))
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

