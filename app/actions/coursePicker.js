import { getSectionsAndAvailabilityForCCN, addCourse } from './api';
import { isValidCCN, isValidDept, isValidDeptNumber, lectureSectionFromCCN,
         lectureSectionsFromDept } from '../helpers/everything';

export const SET_CCN = Symbol('SET_CCN');
function setCCN({ ccn }) {
  return {
    type: SET_CCN,
    ccn,
  };
}

export const SET_LECTURE_SECTION = Symbol('SET_LECTURE_SECTION');
function setLectureSection(lectureSection) {
  return {
    type: SET_LECTURE_SECTION,
    lectureSection,
  };
}

export const SET_LECTURE_SECTIONS = Symbol('SET_LECTURE_SECTIONS');
function setLectureSections(lectureSections) {
  return {
    type: SET_LECTURE_SECTIONS,
    lectureSections,
  };
}

export const SET_DEPT = Symbol('SET_DEPT');
function setDept({ dept }) {
  return {
    type: SET_DEPT,
    dept,
  };
}

export const SET_DEPT_NUMBER = Symbol('SET_DEPT_NUMBER');
function setDeptNumber({ deptNumber }) {
  return {
    type: SET_DEPT_NUMBER,
    deptNumber,
  };
}

export const SET_SELECTION = Symbol('SET_SELECTION');
export function setSelection({ selection, which }) {
  return {
    type: SET_SELECTION,
    selection,
    which,
  };
}

export const SET_GRADING_OPTION = Symbol('SET_GRADING_OPTION');
export function setGradingOption({ option }) {
  return {
    type: SET_GRADING_OPTION,
    option,
  };
}

export const SET_CEC = Symbol('SET_CEC');
export function setCEC({ cec }) {
  return {
    type: SET_CEC,
    cec,
  };
}

export function changedCCN({ ccn }) {
  return (dispatch) => {
    dispatch(setCCN({ ccn }));

    if (isValidCCN(ccn)) {
      dispatch(setLectureSections([lectureSectionFromCCN(ccn)]));
      dispatch(getSectionsAndAvailabilityForCCN({ ccn }));
    }
  };
}

export function changedDept({ dept }) {
  return setDept({ dept });
}

export function changedDeptNumber({ deptNumber }) {
  return (dispatch, getState) => {
    dispatch(setDeptNumber({ deptNumber }));
    // THIS IS A BAD IDEA
    const dept = getState().coursePicker.get('dept');

    if (!isValidDept(dept)) {
      throw new Error(`Dept is not valid? - ${dept}`);
    }

    if (isValidDeptNumber(dept, deptNumber)) {
      const lectureSections = lectureSectionsFromDept(dept, deptNumber);
      dispatch(setLectureSections(lectureSections));
      // Check the first CCN - is this even something we need to do here?
      dispatch(getSectionsAndAvailabilityForCCN({ ccn: lectureSections[0].ccn }));
    }
  };
}

export function changedLectureSelection({ selection, lectureSections }) {
  return (dispatch) => {
    dispatch(setLectureSection(selection));

    return dispatch(getSectionsAndAvailabilityForCCN({ ccn: lectureSections[selection].ccn }));
  };
}

export function clickedAdd(things) {
  return addCourse(things);
}
