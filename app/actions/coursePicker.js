import { getSectionsForCCN, cancelShoppingCartAdd, addCourse } from './api'

export const SET_CCN = Symbol('SET_CCN');
export const CLEAR_CCN = Symbol('CLEAR_CCN');
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

    if (ccn_indexed.hasOwnProperty(ccn)) {
      let data = ccn_indexed[ccn];
      dispatch(setDept({dept: data[0]}));
      dispatch(setDeptNumber({deptNumber: data[1]}));
      dispatch(setCourseName({courseName: data[4]}));
      dispatch(getSectionsForCCN({ccn: ccn}));
    } else {
      dispatch(clearDept());
      dispatch(clearCourse());
      if (getState().coursePicker.get('sections').size > 0) {
        dispatch(cancelShoppingCartAdd());
        dispatch(clearSections());
      }
    }
  }
}

export function changedDept({dept}) {
  return (dispatch, getState) => {
    dispatch(setDept({dept: dept}));

    dispatch(clearCCN());
    dispatch(clearCourse());
    dispatch(setDeptNumber({deptNumber: ""}));
    if (getState().coursePicker.get('sections').size > 0) {
      dispatch(cancelShoppingCartAdd());
      dispatch(clearSections());
    }

    let real_dept = dept.toUpperCase();
    if (depts.hasOwnProperty(real_dept)) {
      real_dept = depts[real_dept];
      let deptNumbers = dept_indexed[real_dept]
      return dispatch(setDeptNumbers({deptNumbers: Object.keys(deptNumbers)}))
    } else {
      let keys = Object.keys(depts);
      let possibleDepts = keys.filter(dept_name => dept_name.toUpperCase().startsWith(dept.toUpperCase()));
      return dispatch(setDeptOptions({deptOptions: possibleDepts}))
    }
  }
}

export function changedDeptNumber({deptNumber}) {
  return (dispatch, getState) => {
    dispatch(setDeptNumber({deptNumber: deptNumber}));
    // THIS IS A BAD IDEA
    let dept = getState().coursePicker.get('dept').toUpperCase();

    dispatch(clearCCN());
    dispatch(clearCourse());
    if (getState().coursePicker.get('sections').size > 0) {
      dispatch(cancelShoppingCartAdd());
      dispatch(clearSections());
    }

    if (!depts.hasOwnProperty(dept)) {
      console.error("wtf -- invalid dept?: "+dept);
    }
    let real_dept = depts[dept];
    if (!dept_indexed.hasOwnProperty(real_dept)) {
      console.error("wtf -- invalid real_dept?: "+real_dept);
    }
    let deptNumbers = dept_indexed[real_dept];
    deptNumber = deptNumber.toUpperCase();
    if (deptNumbers.hasOwnProperty(deptNumber)) {
      let ccn = deptNumbers[deptNumber].toString();
      let data = ccn_indexed[ccn];
      dispatch(setCCN({ccn: ccn}));
      dispatch(setCourseName({courseName: data[4]}));
      dispatch(getSectionsForCCN({ccn: ccn}));
    } else {
      let keys = Object.keys(deptNumbers);
      let possibleDeptsNumbers = keys.filter(dept_num => dept_num.toUpperCase().startsWith(deptNumber.toUpperCase()));
      return dispatch(setDeptNumbers({deptNumbers: possibleDeptsNumbers}))
    }
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
