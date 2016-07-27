import { parseDiscussionTable, parseEnrolledCoursesTable, parseShoppingCartTable } from '../lib/tableParsers'
import { setShoppingCart } from './shoppingCart';
import { setEnrolledCourses } from './enrolled';
import { postFormData } from '../lib/forms';


export const REQUEST_COURSE_ADD = Symbol('REQUEST_COURSE_ADD');
export function requestCourseAdd({ccn, selections}) {
  return {
    type: REQUEST_COURSE_ADD,
    ccn: ccn,
    selections: selections
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
export function receiveSections({ccn, formData, sectionGroups}) {
  return {
    type: RECEIVE_SECTIONS,
    ccn: ccn,
    sectionGroups: sectionGroups
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

export const RECEIVE_SECTION_AVAILABILITY_ERROR = Symbol('RECEIVE_SECTION_AVAILABILITY_ERROR');
export function receiveSectionAvailabilityError({error}) {
  return {
    type: RECEIVE_SECTION_AVAILABILITY_ERROR,
    error: error,
  }
}

export const CANCELED_CART_ADD = Symbol('CANCELED_CART_ADD');
export function canceledCartAdd() {
  return { type: CANCELED_CART_ADD }
}

const CART_URL = 'https://bcsweb.is.berkeley.edu/psc/bcsprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES_2.SSR_SSENRL_CART.GBL';

function sectionsFromLecture({ccn, state}) {
  let sections = state.shoppingCart.toJS().courses;
  let matching_sections = sections.filter(section => section.id === ccn);
  if (!(matching_sections.length === 1)) {
    return { alreadyInCart: false, availability: false }
  }
  let availability = matching_sections[0].availability
  let course_desc = matching_sections[0].course.split('-')[0];
  let alreadyInCart = sections.filter(section => section.course.split('-')[0] === course_desc && (!section.selectable))
                              .map(section => [section, ])
  return { availability: availability, alreadyInCart: alreadyInCart }
}

// WARNING: If this doesn't return any sections, you're ON THE CONFIRMATION PAGE
function mainPageToSectionsOrConfirmation({formData, ccn}) {
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

    let warnings = doc.querySelector('.SSSMSGWARNINGTEXT');
    if (warnings) {
      throw warnings.innerText;
    }

    let sectionTables = doc.querySelectorAll("table[id^='SSR_CLS_TBL_R']");
    let sectionTypes = sectionTables.length;

    if (sectionTypes === 0) {
      // Fuck, we're on the confirmation page HACK TIME
      return { formData: newFormData, sectionGroups: [], maybeBody: body }
    }

    let sectionGroups = [];
    for (let i=0; i < sectionTypes; ++i) {
      let rows = doc.querySelectorAll(`tr [id^='trSSR_CLS_TBL_R${i+1}']`);
      sectionGroups.push(parseDiscussionTable(rows));
    }
    return { formData: newFormData, sectionGroups: sectionGroups, maybeBody: '' };
  })
}

function sectionPageToViewAll({formData}) {
  formData.set('ICAJAX', '0');
  formData.set('ICAction', 'SSR_CLS_TBL_R1$fviewall$0');
  return postFormData(CART_URL, formData)
}

/* MAGIC: if there are no sectionChoices WE ARE ON THE CONFIRMATION PAGE ALREADY */
function sectionPageToConfirmation({formData, sectionChoices, maybeBody}) {
  if (sectionChoices.length === 0 && maybeBody) {
    return parseConfirmationPage(maybeBody)
  }
  formData.set('ICAJAX', '0');
  formData.set('ICAction', 'DERIVED_CLS_DTL_NEXT_PB');
  for (let i=0; i<sectionChoices.length; i++) {
    let choice = sectionChoices[i].toString();
    formData.set(`SSR_CLS_TBL_R${i+1}$sels$${choice}$$0`, choice);
  }
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
    let { alreadyInCart, availability } = sectionsFromLecture({ccn: ccn, state: getState()});
    if (alreadyInCart.length > 0) {
      return Promise.all([
        dispatch(receiveSections({ccn: ccn, sectionGroups: alreadyInCart})),
        dispatch(receiveSectionAvailability({ccn: ccn, availability: availability}))
      ])
    }
    let formData = getState().api.formData;
    return mainPageToSectionsOrConfirmation({formData: formData, ccn: ccn})
      .then(({formData, sectionGroups, maybeBody}) => {
        dispatch(receiveSections({ccn: ccn, sectionGroups: sectionGroups}))
        return { formData: formData, sectionGroups: sectionGroups, maybeBody }
      }).then(({formData, sectionGroups, maybeBody}) => {
        let sectionChoices = Array(sectionGroups.length).fill("0");
        return sectionPageToConfirmation({formData: formData, sectionChoices: sectionChoices, maybeBody: maybeBody})
      }).then(({formData, availability}) => {
        dispatch(receiveSectionAvailability({ccn: ccn, availability: availability}))
        return { formData: formData }
      }).catch((reason) => {
        if (!(typeof reason === 'string' || reason instanceof String)) {
          throw reason;
        }
        if (reason.includes("The class number entered is not valid")) {
          dispatch(receiveSectionAvailabilityError({error: reason}))
        } else if (false) {
        } else {
          throw reason;
        }
        return reloadMainPage()
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

function addToShoppingCart({ccn, selections, formData}) {
  return mainPageToSectionsOrConfirmation({ccn: ccn, formData: formData})
    .then(({formData}) => sectionPageToConfirmation({formData: formData, sectionChoices: selections}))
    .then(({formData}) => confirmationPageToMainPage(formData))
}

export function addCourse({ccn, selections}) {
  return (dispatch, getState) => {
    dispatch(requestCourseAdd({ccn: ccn, selections: selections}));

    let addedToShoppingCart;
    let formData = getState().api.formData;
    let courses = getState().shoppingCart.toJS().courses;
    if (courses.filter(course => course.id === ccn).length === 1) {
      addedToShoppingCart = Promise.resolve({formData: formData, courses: courses})
    } else {
      addedToShoppingCart = addToShoppingCart({ccn: ccn, selections: selections, formData: formData})
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

function reloadMainPage() {
  return fetch(CART_URL, { credentials: 'same-origin' })
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
