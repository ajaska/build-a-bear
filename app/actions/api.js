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
export function receiveCourseAdd({ccn, enrolledCourses, shoppingCartCourses}) {
  return {
    type: RECEIVE_COURSE_ADD,
    ccn: ccn,
    enrolledCourses: enrolledCourses,
    shoppingCartCourses: shoppingCartCourses
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

export const RECEIVE_SECTION_AVAILABILITY = Symbol('RECEIVE_SECTION_AVAILABILITY');
export function receiveSectionAvailability({ccn, availability}) {
  return {
    type: RECEIVE_SECTION_AVAILABILITY,
    ccn: ccn,
    availability: availability
  }
}

export const CANCELED_CART_ADD = Symbol('CANCELED_CART_ADD');
export function canceledCartAdd() {
  return { type: CANCELED_CART_ADD }
}

const CART_URL = 'https://bcsweb.is.berkeley.edu/psc/bcsprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES_2.SSR_SSENRL_CART.GBL';

function sectionFromLecture({ccn, state}) {
  let sections = state.shoppingCart.toJS().courses;
  let matching_sections = sections.filter(section => section.id === ccn);
  if (!(matching_sections.length === 1)) {
    return false
  }
  let course_desc = matching_sections[0].course.split('-')[0];
  return sections.filter(section => section.course.split('-')[0] === course_desc && (!section.selectable))
}

function mainPageToSections({formData, ccn}) {
  formData.set('ICAJAX', '0');
  formData.set('ICAction', 'DERIVED_REGFRM1_SSR_PB_ADDTOLIST2$9$');
  formData.set('DERIVED_REGFRM1_CLASS_NBR', ccn.toString());
  formData.set('DERIVED_REGFRM1_SSR_CLS_SRCH_TYPE$249$', '06');

  return postFormData(CART_URL, formData).then(body => parseSectionPage(body))
}

function docFromBody(body) {
  let parser = new DOMParser();
  return parser.parseFromString(body, "text/html");
}

function parseSectionPage(body) {
  let doc = docFromBody(body);
  let newForm = doc.getElementById('SSR_SSENRL_CART');
  let newFormData = new FormData(newForm);
  if (!newForm) { throw "Error code 3" }

  let maybeViewAll;

  let viewAll = doc.querySelector("[id^='SSR_CLS_TBL_R1$fviewall$0']");
  if (viewAll && viewAll.innerText.includes("View All")) {
    maybeViewAll = sectionPageToViewAll({formData: newFormData}).then((body) => {
      let doc = docFromBody(body);
      let newForm = doc.getElementById('SSR_SSENRL_CART');
      let newFormData = new FormData(newForm);
      return {body: body, formData: newFormData}
    })
  } else {
    maybeViewAll = Promise.resolve({body: body, formData: newFormData})
  }
  return maybeViewAll.then(({body, formData}) => {
    let doc = docFromBody(body);
    let newFormData = new FormData(doc.getElementById('SSR_SSENRL_CART'));
    let rows = doc.querySelectorAll("tr [id^='trSSR_CLS_TBL']");
    return { formData: newFormData, sections: parseDiscussionTable(rows) };
  })
}

function sectionPageToViewAll({formData}) {
  formData.set('ICAJAX', '0');
  formData.set('ICAction', 'SSR_CLS_TBL_R1$fviewall$0');
  return postFormData(CART_URL, formData)
}

function sectionPageToConfirmation({formData, sectionChoice}) {
  formData.set('ICAJAX', '0');
  formData.set('ICAction', 'DERIVED_CLS_DTL_NEXT_PB');
  formData.set('SSR_CLS_TBL_R1$sels$1$$0', sectionChoice.toString());
  return postFormData(CART_URL, formData).then(body => parseConfirmationPage(body))
}

function parseConfirmationPage(body) {
  let doc = docFromBody(body);
  let newFormData = new FormData(doc.getElementById('SSR_SSENRL_CART'));
  let waitlistedDiv = doc.querySelector("[id^='win0divDERIVED_CLS_DTL_SSR_DESCRSHORT$0']");
  let availability = "Unknown";
  if (waitlistedDiv.innerText.includes("Open")) {
    availability = "Open";
  } else if (waitlistedDiv.innerText.includes("Wait List")) {
    availability = "Wait List";
  } else if (waitlistedDiv.innerText.includes("Closed")) {
    availability = "Closed";
  }
  return { formData: newFormData, availability: availability }
}

function confirmationPageToMainPage(formData, permissionNumber = '',  graded = true, waitlistOk = false) {
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

  return postFormData(CART_URL, formData).then(function(body) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(body, "text/html");
    let shoppingCartTableRows = doc.querySelectorAll("tr [id^='trSSR_REGFORM_VW']");
    let shoppingCartCourses = parseShoppingCartTable(shoppingCartTableRows);
    let newForm = doc.getElementById('SSR_SSENRL_CART');
    let newFormData = new FormData(newForm);
    return { formData: newFormData, courses: shoppingCartCourses }
  });
}

export function getSectionsAndAvailabilityForCCN({ccn}) {
  return (dispatch, getState) => {
    dispatch(requestSections({ccn: ccn}))
    let alreadyInCart = sectionFromLecture({ccn: ccn, state: getState()});
    if (alreadyInCart.length > 0) {
      return dispatch(receiveSections({
        ccn: ccn,
        sections: alreadyInCart
      }))
    }
    let formData = getState().api.formData;
    return mainPageToSections({formData: formData, ccn: ccn})
      .then(({formData, sections}) => {
        dispatch(receiveSections({ccn: ccn, sections: sections}))
        return { formData: formData }
      }).then(({formData}) => {
        return sectionPageToConfirmation({formData: formData, sectionChoice: 0})
      }).then(({formData, availability}) => {
        dispatch(receiveSectionAvailability({ccn: ccn, availability: availability}))
        return { formData: formData }
      }).then(({formData}) => {
        return dispatch(cancelShoppingCartAdd({formData}))
      })
  }
}


export function cancelShoppingCartAdd({formData}) {
  return (dispatch, getState) => {
    formData.set('ICAction', 'DERIVED_CLS_DTL_CANCEL_PB');
    return postFormData(CART_URL, formData).then(function(body) {
      let parser = new DOMParser();
      let doc = parser.parseFromString(body, "text/html");
      let newForm = doc.getElementById('SSR_SSENRL_CART');
      if(!newForm) { throw "Error code 1" }
      let newFormData = new FormData(newForm);
      return newFormData
    }).then(function(formData) {
      formData.set('ICAJAX', '1');
      formData.set('ICAction', '#ICCancel');
      formData.set('ICNAVTYPEDROPDWN', '0');
      return postFormData(CART_URL, formData)
    }).then(function(body) { })
    .then(() => fetch(CART_URL, { credentials: 'same-origin' }))
    .then(response => response.text())
    .then(function(body) {
      let parser = new DOMParser();
      let doc = parser.parseFromString(body, "text/html");
      let newForm = doc.getElementById('SSR_SSENRL_CART');
      if(!newForm) { throw "Error code 2" }
      let newFormData = new FormData(newForm);
      return dispatch(setFormData({formData: newFormData}))
    }).then(() => {dispatch(canceledCartAdd())})
  }
}

function addToShoppingCart({ccn, selection, formData}) {
  return mainPageToSections({ccn: ccn, formData: formData})
    .then(({formData}) => sectionPageToConfirmation({formData: formData, sectionChoice: selection}))
    .then(({formData}) => confirmationPageToMainPage(formData))
}

export function addCourse({ccn, selection}) {
  return (dispatch, getState) => {
    dispatch(requestCourseAdd({ccn: ccn, selection: selection}));

    let addedToShoppingCart;
    let formData = getState().api.formData;
    let courses = getState().shoppingCart.toJS().courses;
    if (courses.filter(course => course.id === ccn).length === 1) {
      addedToShoppingCart = Promise.resolve({formData: formData, courses: courses})
    } else {
      // let chooseSection;
      /* if(!selection) {
        chooseSection = Promise.resolve({formData: formData})
      } else {
        chooseSection = selectSection(selection, formData)
      } */
      addedToShoppingCart = addToShoppingCart({ccn: ccn, selection: selection, formData: formData})
      // addedToShoppingCart = chooseSection.then(({formData}) => confirmChoice(formData))
    }
    return addedToShoppingCart.then(({formData, courses}) => {
      let selectableCourses = courses.filter(course => course.selectable);
      let courseToAddPos = courses.map(course => course.id).indexOf(ccn);

      return dispatch(addFromShoppingCart({
        formData: formData,
        positions: selectableCourses,
        positionToEnroll: courseToAddPos,
      }))
    }).then(function({formData, enrolledCourses, shoppingCartCourses}) {
      dispatch(setFormData({formData: formData}))
      return dispatch(receiveCourseAdd({ccn: ccn, enrolledCourses: enrolledCourses, shoppingCartCourses: shoppingCartCourses}))
    })
  }
}


export function addFromShoppingCart({formData, positions, positionToEnroll}) {
  return (dispatch) => {
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
    }).then(() => {
      let url = 'https://bcsweb.is.berkeley.edu/psc/bcsprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES_2.SSR_SSENRL_CART.GBL';
      return fetch(url, { credentials: 'same-origin' })
    })
    .then(response => response.text())
    .then(function(body) {
      let parser = new DOMParser();
      let doc = parser.parseFromString(body, "text/html");
      let enrolledTableRows = doc.querySelectorAll("tr [id^='trSTDNT_ENRL_SSVW']");
      let shoppingCartTableRows = doc.querySelectorAll("tr [id^='trSSR_REGFORM_VW']");
      let enrolledCourses = parseEnrolledCoursesTable(enrolledTableRows);
      let shoppingCartCourses = parseShoppingCartTable(shoppingCartTableRows);
      let formData = new FormData(doc.getElementById('SSR_SSENRL_CART'));
      return {formData: formData, enrolledCourses: enrolledCourses, shoppingCartCourses}
    })
  }
}
