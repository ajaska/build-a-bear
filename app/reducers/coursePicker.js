import * as ActionType from '../actions/coursePicker';
import * as APIActionType from '../actions/api';
import Immutable from 'immutable';

let depts_file = require('../data/depts.json');

let defaultState = Immutable.fromJS({
  ccn: "",
  sections: [],
  isLoadingSections: false,
  isAddingCourse: false,
  dept: "",
  deptOptions: Object.keys(depts_file),
  deptNumber: "",
  deptNumbers: [],
  courseName: "",
  selection: "0",
})

export default function(state = defaultState, action) {
  switch(action.type) {
    case ActionType.SET_CCN:
      return state.set('ccn', action.ccn)
    case ActionType.SET_DEPT:
      return state.set('dept', action.dept)
    case ActionType.SET_DEPT_OPTIONS:
      return state.set('deptOptions', action.deptOptions)
    case ActionType.SET_DEPT_NUMBER:
      return state.set('deptNumber', action.deptNumber)
    case ActionType.SET_DEPT_NUMBERS:
      return state.set('deptNumbers', Immutable.fromJS(action.deptNumbers))
    case ActionType.CLEAR_CCN:
      return state.set('ccn', defaultState.get('ccn'))
    case ActionType.CLEAR_DEPT:
      return state.set('dept', defaultState.get('dept'))
                  .set('deptOptions', defaultState.get('deptOptions'))
                  .set('deptNumber', defaultState.get('deptNumber'))
                  .set('deptNumbers', defaultState.get('deptNumbers'))
    case ActionType.SET_COURSE_NAME:
      return state.set('courseName', action.courseName)
    case ActionType.CLEAR_COURSE:
      return state.set('courseName', defaultState.get('courseName'))
    case ActionType.CLEAR_SECTIONS:
      return state.set('sections', defaultState.get('sections'))
                  .set('selection', defaultState.get('selection'))
    case ActionType.SET_SELECTION:
      return state.set('selection', action.selection)
    case APIActionType.REQUEST_COURSE_ADD:
      return state.set('isAddingCourse', true)
    case APIActionType.RECEIVE_COURSE_ADD:
      return state.set('dept', defaultState.get('dept'))
                  .set('deptOptions', defaultState.get('deptOptions'))
                  .set('deptNumber', defaultState.get('deptNumber'))
                  .set('deptNumbers', defaultState.get('deptNumbers'))
                  .set('courseName', defaultState.get('courseName'))
                  .set('ccn', defaultState.get('ccn'))
    case APIActionType.REQUEST_SECTIONS:
      return state.set('isLoadingSections', true)
    case APIActionType.RECEIVE_SECTIONS:
      if (state.get('ccn') === action.ccn) {
        return state.set('sections', Immutable.fromJS(action.sections))
                    .set('isLoadingSections', false)
      }
      return state
    default:
      return state
  }
}

