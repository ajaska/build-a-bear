import { getSectionsForCCN, cancelShoppingCartAdd, addCourse } from './api'
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

let ccn_indexed = require('../data/ccn_indexed.json');
let depts = require('../data/depts.json');
let dept_indexed = require('../data/dept_indexed.json');

export function changedCCN({ccn}) {
  return (dispatch, getState) => {
    dispatch(setCCN({ccn: ccn}));

    if (isValidCCN(ccn)) {
      dispatch(setLectureSections([lectureSectionFromCCN(ccn)]));
      dispatch(getSectionsForCCN({ccn: ccn}));
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
    let dept = getState().coursePicker.get('dept').toUpperCase();

    if (!isValidDept(dept)) {
      console.error("wtf -- invalid dept?: "+dept);
    }

    if (isValidDeptNumber(dept, deptNumber)) {
      let lectureSections = lectureSectionsFromDept(dept, deptNumber);
      dispatch(setLectureSections(lectureSections));
      dispatch(getSectionsForCCN({ccn: lectureSections[0].ccn}));
    }
  }
}

export function changedLectureSelection({selection, sections}) {
  return (dispatch, getState) => {
    dispatch(setLectureSection(selection));

    return Promise.resolve(dispatch(cancelShoppingCartAdd())).then(() => {
      return dispatch(getSectionsForCCN({ccn: sections[selection].ccn}));
    })
  }
}

export function clickedAdd({ccn, selection}) {
  return (dispatch) => {
    dispatch(addCourse({ccn: ccn, selection: selection}))
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

export function setSelection({selection}) {
  return {
    type: SET_SELECTION,
    selection: selection
  }
}
