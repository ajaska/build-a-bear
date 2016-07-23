export const SET_CCN = Symbol('SET_CCN');
export const SET_DEPT = Symbol('SET_DEPT');
export const SET_DEPT_NUMBER = Symbol('SET_DEPT_NUMBER');
export const SET_COURSE_NAME  = Symbol('SET_COURSE_NAME');

let ccn_indexed = require('../data/ccn_indexed.json');

export function changedCCN({ccn}) {
  return (dispatch) => {
    dispatch(setCCN({ccn: ccn}));

    if (ccn_indexed.hasOwnProperty(ccn)) {
      let data = ccn_indexed[ccn];
      dispatch(setDept({dept: data[0]}));
      dispatch(setDeptNumber({dept_number: data[1]}));
      dispatch(setCourseName({course_name: data[4]}));
    } else {
      dispatch(setDept({dept: ""}));
      dispatch(setDeptNumber({dept_number: ""}));
      dispatch(setCourseName({course_name: ""}));
    }
  }
}

function setCCN({ccn}) {
  return {
    type: SET_CCN,
    ccn: ccn
  }
}

function setDept({dept}) {
  return {
    type: SET_DEPT,
    dept: dept
  }
}

function setDeptNumber({dept_number}) {
  return {
    type: SET_DEPT_NUMBER,
    dept_number: dept_number
  }
}

export function setCourseName({course_name}) {
  return {
    type: SET_COURSE_NAME,
    course_name: course_name
  }
}
