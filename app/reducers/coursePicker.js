import * as ActionType from '../actions/coursePicker';
import * as APIActionType from '../actions/api';
import Immutable from 'immutable';

const defaultState = Immutable.fromJS({
  ccn: '',
  error: '',
  lectureSections: [],
  lectureSection: '',
  lectureAvailability: '',
  isLoadingLectureAvailability: false,
  sectionGroups: [],
  selections: [],
  isLoadingSections: false,
  dept: '',
  deptNumber: '',
  isAddingCourse: false,
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case ActionType.SET_CCN:
      return defaultState.set('ccn', action.ccn);
    case ActionType.SET_LECTURE_SECTION: {
      const acl = action.lectureSection;
      return state.set('lectureSection', acl)
                  .set('ccn', state.get('lectureSections')[acl].ccn)
                  .set('sectionGroups', defaultState.get('sectionGroups'))
                  .set('isLoadingSections', true);
    }
    case ActionType.SET_LECTURE_SECTIONS:
      return state.set('dept', action.lectureSections[0].dept)
                  .set('deptNumber', action.lectureSections[0].deptNumber)
                  .set('lectureSections', action.lectureSections)
                  .set('lectureSection', '0')
                  .set('ccn', action.lectureSections[0].ccn)
                  .set('isLoadingSections', true);
    case ActionType.SET_DEPT:
      return defaultState.set('dept', action.dept);
    case ActionType.SET_DEPT_NUMBER:
      return defaultState.set('deptNumber', action.deptNumber)
                         .set('dept', state.get('dept'));
    case ActionType.SET_SELECTION:
      return state.setIn(['selections', action.which], action.selection);
    case APIActionType.REQUEST_COURSE_ADD:
      return state.set('isAddingCourse', true);
    case APIActionType.RECEIVE_COURSE_ADD:
      return defaultState;
    case APIActionType.REQUEST_SECTIONS:
      return state.set('isLoadingSections', true)
                  .set('isLoadingLectureAvailability', true);
    case APIActionType.RECEIVE_SECTIONS:
      if (state.get('ccn') === action.ccn) {
        const selectionsArray = Immutable.fromJS(Array(action.sectionGroups.length).fill('0'));
        return state.set('sectionGroups', Immutable.fromJS(action.sectionGroups))
                    .set('selections', selectionsArray)
                    .set('isLoadingSections', false);
      }
      return state;
    case APIActionType.RECEIVE_SECTION_AVAILABILITY:
      if (state.get('ccn') === action.ccn) {
        return state.set('lectureAvailability', action.availability)
                    .set('isLoadingLectureAvailability', false);
      }
      return state;
    case APIActionType.RECEIVE_SECTION_AVAILABILITY_ERROR:
      return defaultState.set('error', action.error);
    default:
      return state;
  }
}

