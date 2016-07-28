import { getSectionsAndAvailabilityForCCN, cancelShoppingCartAdd, addCourse } from './api'
import { isValidCCN, isValidDept, isValidDeptNumber, lectureSectionFromCCN, lectureSectionsFromDept } from '../helpers/everything'

export const SET_CCN = Symbol('SET_CCN');
export const CLEAR_CCN = Symbol('CLEAR_CCN');
export const SET_LECTURE_SECTION = Symbol('SET_LECTURE_SECTION');
export const SET_LECTURE_SECTIONS = Symbol('SET_LECTURE_SECTIONS');
export const SET_DEPT = Symbol('SET_DEPT');
export const SET_DEPT_OPTIONS = Symbol('SET_DEPT_OPTIONS');
export const SET_DEPT_NUMBER = Symbol('SET_DEPT_NUMBER');
export const SET_DEPT_NUMBERS = Symbol('SET_DEPT_NUMBERS');
export const CLEAR_DEPT = Symbol('CLEAR_DEPT');
export const SET_COURSE_NAME  = Symbol('SET_COURSE_NAME');
export const CLEAR_COURSE = Symbol('CLEAR_COURSE');
export const SET_SELECTION = Symbol('SET_SELECTION');
export const CLEAR_SECTIONS = Symbol('CLEAR_SECTIONS');

export function changedCCN({ccn}) {
  return (dispatch, getState) => {
    dispatch(setCCN({ccn: ccn}));

    if (isValidCCN(ccn)) {
      dispatch(setLectureSections([lectureSectionFromCCN(ccn)]));
      dispatch(getSectionsAndAvailabilityForCCN({ccn: ccn}));
    }
  }
}

export function changedDept({dept}) {
  return (dispatch, getState) => {
    dispatch(setDept({dept: dept}));
  }
}

export function changedDeptNumber({deptNumber}) {
  return (dispatch, getState) => {
    dispatch(setDeptNumber({deptNumber: deptNumber}));
    // THIS IS A BAD IDEA
    let dept = getState().coursePicker.get('dept');

    if (!isValidDept(dept)) {
      console.error("wtf -- invalid dept?: "+dept);
    }

    if (isValidDeptNumber(dept, deptNumber)) {
      let lectureSections = lectureSectionsFromDept(dept, deptNumber);
      dispatch(setLectureSections(lectureSections));
      dispatch(getSectionsAndAvailabilityForCCN({ccn: lectureSections[0].ccn}));
    }
  }
}

export function changedLectureSelection({selection, lectureSections}) {
  return (dispatch) => {
    dispatch(setLectureSection(selection));

    return dispatch(getSectionsAndAvailabilityForCCN({ccn: lectureSections[selection].ccn}));
  }
}

export function clickedAdd({ccn, selections}) {
  return (dispatch) => {
    dispatch(addCourse({ccn: ccn, selections: selections}))
      .then(() => {
        dispatch(setCCN({ccn: ""}));
        dispatch(setDept({dept: ""}));
        dispatch(setDeptNumber({deptNumber: ""}));
        dispatch(setCourseName({courseName: ""}));
        dispatch(clearSections());
      })
  }
}

function setCCN({ccn}) {
  return {
    type: SET_CCN,
    ccn: ccn
  }
}

function clearCCN() {
  return { type: CLEAR_CCN }
}

function setLectureSection(lectureSection) {
  return {
    type: SET_LECTURE_SECTION,
    lectureSection: lectureSection
  }
}

function setLectureSections(lectureSections) {
  return {
    type: SET_LECTURE_SECTIONS,
    lectureSections: lectureSections
  }
}

function setDept({dept}) {
  return {
    type: SET_DEPT,
    dept: dept
  }
}

function setDeptNumber({deptNumber}) {
  return {
    type: SET_DEPT_NUMBER,
    deptNumber: deptNumber
  }
}

function setDeptNumbers({deptNumbers}) {
  return {
    type: SET_DEPT_NUMBERS,
    deptNumbers: deptNumbers
  }
}

function setDeptOptions({deptOptions}) {
  return {
    type: SET_DEPT_OPTIONS,
    deptOptions: deptOptions
  }
}

function clearDept() {
  return { type: CLEAR_DEPT }
}

function setCourseName({courseName}) {
  return {
    type: SET_COURSE_NAME,
    courseName: courseName
  }
}

function clearCourse() {
  return { type: CLEAR_COURSE }
}

function clearSections() {
  return {
    type: CLEAR_SECTIONS
  }
}

export function setSelection({selection, which}) {
  return {
    type: SET_SELECTION,
    selection: selection,
    which: which,
  }
}
