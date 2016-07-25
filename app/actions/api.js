import { parseDiscussionTable, parseEnrolledCoursesTable, parseShoppingCartTable } from '../lib/tableParsers'
import { setShoppingCart } from './shoppingCart';
import { setEnrolledCourses } from './enrolled';
import { postFormData } from '../lib/forms';


export const REQUEST_COURSE_ADD = Symbol('REQUEST_COURSE_ADD');
export function requestCourseAdd({ccn, selection}) {
  return {
    type: REQUEST_COURSE_ADD,
    ccn: ccn,
    selection: selection
  }
}

export const RECEIVE_COURSE_ADD = Symbol("RECEIVE_COURSE_ADD");
export function receiveCourseAdd({ccn, courses}) {
  return {
    type: RECEIVE_COURSE_ADD,
    ccn: ccn,
    courses: courses
  }
}


export const SET_FORMDATA = Symbol('SET_FORMDATA');
export function setFormData({formData}) {
  return {
    type: SET_FORMDATA,
    formData: formData
  }
}


export const REQUEST_SECTIONS = Symbol('REQUEST_SECTIONS');
export function requestSections({ccn}) {
  return {
    type: REQUEST_SECTIONS,
    ccn: ccn
  }
}

export const RECEIVE_SECTIONS = Symbol('RECEIVE_SECTIONS');
export function receiveSections({ccn, formData, sections}) {
  return {
    type: RECEIVE_SECTIONS,
    ccn: ccn,
    sections: sections
  }
}

export const REQUEST_REAL_COURSE_ADD = Symbol('REQUEST_REAL_COURSE_ADD');
export function requestRealCourseAdd() {
  return { type: REQUEST_REAL_COURSE_ADD }
}

export const RECEIVE_REAL_COURSE_ADD = Symbol("RECEIVE_REAL_COURSE_ADD");
export function receiveRealCourseAdd() {
  return { type: RECEIVE_REAL_COURSE_ADD }
}


export function getSectionsForCCN({ccn}) {
  return (dispatch, getState) => {
    dispatch(requestSections({ccn: ccn}))
    let formData = getState().api.formData;

    let url = 'https://bcsweb.is.berkeley.edu/psc/bcsprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES_2.SSR_SSENRL_CART.GBL';
    formData.set('ICAJAX', '0');
    formData.set('ICAction', 'DERIVED_REGFRM1_SSR_PB_ADDTOLIST2$9$');
    formData.set('DERIVED_REGFRM1_CLASS_NBR', ccn.toString());
    formData.set('DERIVED_REGFRM1_SSR_CLS_SRCH_TYPE$249$', '06');

    return postFormData(url, formData).then(function(body) {
      let parser = new DOMParser();
      let doc = parser.parseFromString(body, "text/html");
      let newForm = doc.getElementById('SSR_SSENRL_CART');
      let newFormData = new FormData(newForm);

      let viewall = doc.querySelector("[id^='SSR_CLS_TBL_R1$fviewall$0']");
      if (viewall && viewall.innerText.includes("View All")) {
        newFormData.set('ICAJAX', '0');
        newFormData.set('ICAction', 'SSR_CLS_TBL_R1$fviewall$0');
        return postFormData(url, newFormData).then(function(body) {
          let parser = new DOMParser();
          let doc = parser.parseFromString(body, "text/html");
          let newForm = doc.getElementById('SSR_SSENRL_CART');
          let newFormData = new FormData(newForm);
          let rows = doc.querySelectorAll("tr [id^='trSSR_CLS_TBL']");
          let sections = parseDiscussionTable(rows);

          return {formData: newFormData, sections: sections}
        });
      } else {
        let rows = doc.querySelectorAll("tr [id^='trSSR_CLS_TBL']");
        let sections = parseDiscussionTable(rows);

        return {formData: newFormData, sections: sections}
      }
    }).then(function({formData, sections}) {
      dispatch(setFormData({formData: formData}))
      return dispatch(receiveSections({
        ccn: ccn,
        sections: sections
      }))
    });
  };
}


export function cancelShoppingCartAdd() {
  return (dispatch, getState) => {
    let formData = getState().api.formData;

    let url = 'https://bcsweb.is.berkeley.edu/psc/bcsprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES_2.SSR_SSENRL_CART.GBL';
    formData.set('ICAJAX', '0');
    formData.set('ICAction', 'DERIVED_CLS_DTL_CANCEL_PB');
    return postFormData(url, formData).then(function(body) {
      let parser = new DOMParser();
      let doc = parser.parseFromString(body, "text/html");
      let newForm = doc.getElementById('SSR_SSENRL_CART');
      let newFormData = new FormData(newForm);
      return newFormData
    }).then(function(formData) {
      formData.set('ICAJAX', '0');
      formData.set('ICAction', '#ICCancel');
      return postFormData(url, formData)
    }).then(function(body) { })
    .then(() => fetch(url, { credentials: 'same-origin' }))
    .then(response => response.text())
    .then(function(body) {
      let parser = new DOMParser();
      let doc = parser.parseFromString(body, "text/html");
      let newForm = doc.getElementById('SSR_SSENRL_CART');
      let newFormData = new FormData(newForm);
      return dispatch(setFormData({formData: newFormData}))
    })


  }
}

export function addCourse({ccn, selection}) {
  return (dispatch, getState) => {
    dispatch(requestCourseAdd({ccn: ccn, selection: selection}));

    let formData = getState().api.formData;

    let chooseSection;
    if(!selection) {
      chooseSection = Promise.resolve({formData: formData})
    } else {
      chooseSection = selectSection(selection, formData)
    }

    return chooseSection
      .then(({formData}) => confirmChoice(formData))
      .then(({formData, courses}) => {
        dispatch(setFormData({formData: formData}))
        return dispatch(receiveCourseAdd({ccn: ccn, courses: courses}))
      })
  }
}

export function selectSection(choice, formData) {
  let url = 'https://bcsweb.is.berkeley.edu/psc/bcsprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES_2.SSR_SSENRL_CART.GBL';
  formData.set('ICAJAX', '0');
  formData.set('ICAction', 'DERIVED_CLS_DTL_NEXT_PB');
  formData.set('SSR_CLS_TBL_R1$sels$1$$0', choice.toString());

  return postFormData(url, formData).then(function(body) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(body, "text/html");
    let newForm = doc.getElementById('SSR_SSENRL_CART');
    let newFormData = new FormData(newForm);
    return { formData: newFormData }
  });
}

export function confirmChoice(formData, permissionNumber = '',  graded = true, waitlistOk = false) {
  let url = 'https://bcsweb.is.berkeley.edu/psc/bcsprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES_2.SSR_SSENRL_CART.GBL';
  formData.set('ICAJAX', '0');
  formData.set('ICAction', 'DERIVED_CLS_DTL_NEXT_PB$280$');

  formData.set('DERIVED_CLS_DTL_CLASS_PRMSN_NBR$118$', permissionNumber.toString());
  if (waitlistOk) {
    formData.set('DERIVED_CLS_DTL_WAIT_LIST_OKAY$125$$chk', 'Y');
    formData.set('DERIVED_CLS_DTL_WAIT_LIST_OKAY$125$', 'Y');
  } else {
    formData.set('DERIVED_CLS_DTL_WAIT_LIST_OKAY$125$$chk', 'N');
  }
  if (graded) {
    formData.set('DERIVED_CLS_DTL_SSR_GRADE_BASIS_SS$30$', 'GRD');
  } else {
    formData.set('DERIVED_CLS_DTL_SSR_GRADE_BASIS_SS$30$', 'GRD');
  }

  return postFormData(url, formData).then(function(body) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(body, "text/html");
    let shoppingCartTableRows = doc.querySelectorAll("tr [id^='trSSR_REGFORM_VW']");
    let shoppingCartCourses = parseShoppingCartTable(shoppingCartTableRows);
    let newForm = doc.getElementById('SSR_SSENRL_CART');
    let newFormData = new FormData(newForm);
    return { formData: newFormData, courses: shoppingCartCourses }
  });
}

export function addFromShoppingCart({formData, positions, positionToEnroll}) {
  return (dispatch) => {
    dispatch(requestRealCourseAdd());
    let url = 'https://bcsweb.is.berkeley.edu/psc/bcsprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES_2.SSR_SSENRL_CART.GBL';

    formData.set('ICAJAX', '0');
    formData.set('ICAction', 'DERIVED_REGFRM1_LINK_ADD_ENRL');
    formData.set('DERIVED_REGFRM1_CLASS_NBR', '');
    formData.set('DERIVED_REGFRM1_SSR_CLS_SRCH_TYPE$249$', '06');
    for (let i=0; i < positions.length; ++i) {
      formData.set('P_SELECT$chk$' + positions[i].toString(), 'N');
    }
    formData.set('P_SELECT$chk$' + positionToEnroll.toString(), 'Y');
    formData.set('P_SELECT$' + positionToEnroll.toString(), 'Y');

    return postFormData(url, formData).then(function(body) {
      let parser = new DOMParser();
      let doc = parser.parseFromString(body, "text/html");
      let newForm = doc.getElementById('SSR_SSENRL_ADD');
      let newFormData = new FormData(newForm);
      return { formData: newFormData }
    }).then(function({formData}) {
      let url = 'https://bcsweb.is.berkeley.edu/psc/bcsprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES_2.SSR_SSENRL_ADD.GBL';
      formData.set('ICAJAX', '0');
      formData.set('ICAction', 'DERIVED_REGFRM1_SSR_PB_SUBMIT');
      return postFormData(url, formData)
    }).then(function(body) {
      let parser = new DOMParser();
      let doc = parser.parseFromString(body, "text/html");
      let enrolledTableRows = doc.querySelectorAll("tr [id^='trSTDNT_ENRL_SSVW']");
      let shoppingCartTableRows = doc.querySelectorAll("tr [id^='trSSR_REGFORM_VW']");
      let enrolledCourses = parseEnrolledCoursesTable(enrolledTableRows);
      let shoppingCartCourses = parseShoppingCartTable(shoppingCartTableRows);
      let formData = new FormData(doc.getElementById('SSR_SSENRL_CART'));
      return Promise.all([
        dispatch(setShoppingCart({courses: shoppingCartCourses})),
        dispatch(setEnrolledCourses({courses: enrolledCourses})),
        dispatch(setFormData({formData: formData})),
      ])
    }).then(() => dispatch(receiveRealCourseAdd()))
  }
}
