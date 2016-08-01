import { postFormData } from '../lib/forms';
import { pages, parseResponse } from '../lib/responseParser';


export const REQUEST_COURSE_ADD = Symbol('REQUEST_COURSE_ADD');
export function requestCourseAdd({ ccn, selections }) {
  return {
    type: REQUEST_COURSE_ADD,
    ccn,
    selections,
  };
}

export const RECEIVE_COURSE_ADD = Symbol('RECEIVE_COURSE_ADD');
export function receiveCourseAdd({ ccn, enrolledCourses, shoppingCartCourses }) {
  return {
    type: RECEIVE_COURSE_ADD,
    ccn,
    enrolledCourses,
    shoppingCartCourses,
  };
}


export const SET_FORMDATA = Symbol('SET_FORMDATA');
export function setFormData({ formData }) {
  return {
    type: SET_FORMDATA,
    formData,
  };
}


export const REQUEST_SECTIONS = Symbol('REQUEST_SECTIONS');
export function requestSections({ ccn }) {
  return {
    type: REQUEST_SECTIONS,
    ccn,
  };
}

export const RECEIVE_SECTIONS = Symbol('RECEIVE_SECTIONS');
export function receiveSections({ ccn, sectionGroups }) {
  return {
    type: RECEIVE_SECTIONS,
    ccn,
    sectionGroups,
  };
}

export const REQUEST_CART_DROP = Symbol('REQUEST_CART_DROP');
function requestCartDrop({ ccn }) {
  return {
    type: REQUEST_CART_DROP,
    ccn,
  };
}

export const RECEIVE_CART_DROP = Symbol('RECEIVE_CART_DROP');
function receiveCartDrop({ ccn, enrolledCourses, shoppingCartCourses }) {
  return {
    type: RECEIVE_CART_DROP,
    ccn,
    enrolledCourses,
    shoppingCartCourses,
  };
}

export const RECEIVE_SECTION_AVAILABILITY = Symbol('RECEIVE_SECTION_AVAILABILITY');
export function receiveSectionAvailability({ ccn, availability }) {
  return {
    type: RECEIVE_SECTION_AVAILABILITY,
    ccn,
    availability,
  };
}

export const RECEIVE_SECTION_AVAILABILITY_ERROR = Symbol('RECEIVE_SECTION_AVAILABILITY_ERROR');
export function receiveSectionAvailabilityError({ error }) {
  return {
    type: RECEIVE_SECTION_AVAILABILITY_ERROR,
    error,
  };
}

export const CANCELED_CART_ADD = Symbol('CANCELED_CART_ADD');
export function canceledCartAdd() {
  return { type: CANCELED_CART_ADD };
}

const CART_URL = 'https://bcsweb.is.berkeley.edu/psc/bcsprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES_2.SSR_SSENRL_CART.GBL';
const ADD_URL = 'https://bcsweb.is.berkeley.edu/psc/bcsprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES_2.SSR_SSENRL_ADD.GBL';

function sectionsFromLecture({ ccn, state }) {
  const sections = state.shoppingCart.toJS().courses;
  const matchingSections = sections.filter(section => section.id === ccn);
  if (!(matchingSections.length === 1)) {
    return { alreadyInCart: false, availability: false };
  }
  const availability = matchingSections[0].availability;
  const courseDesc = matchingSections[0].course.split('-')[0];
  const alreadyInCart = sections.filter(section => (
    section.course.split('-')[0] === courseDesc && (!section.selectable)
  )).map(section => [section]);
  return { availability, alreadyInCart };
}

function docFromBody(body) {
  const parser = new DOMParser();
  return parser.parseFromString(body, 'text/html');
}

function sectionPageToViewAll({ formData, which }) {
  formData.set('ICAJAX', '0');
  formData.set('ICAction', `SSR_CLS_TBL_R${which}$fviewall$0`);
  return postFormData(CART_URL, formData);
}

function maybeViewAll({ doc }, count = 0) {
  if (count > 2) {
    return Promise.resolve({ doc });
  }
  const form = doc.getElementById('SSR_SSENRL_CART');
  const formData = new FormData(form);
  const viewAll = doc.querySelector(`[id^='SSR_CLS_TBL_R${count + 1}$fviewall$0']`);
  if (viewAll && viewAll.innerText.includes('View All')) {
    return sectionPageToViewAll({ formData, which: count + 1 }).then((body) => {
      const newDoc = docFromBody(body);
      return maybeViewAll({ doc: newDoc }, count + 1);
    });
  }
  return Promise.resolve({ doc });
}

function parseSectionPage(body) {
  const doc = docFromBody(body);

  const viewAll = maybeViewAll({ doc });

  return viewAll.then(({ doc: newDoc }) => {
    const info = parseResponse(newDoc);
    const { pageName } = info;

    if (pageName === pages.SECTIONS_PAGE) {
      return info;
    } else if (pageName === pages.CONFIRMATION_PAGE || pageName === pages.ALT_CONFIRMATION_PAGE) {
      return Object.assign({}, info, { sectionGroups: [] });
    }

    throw new Error('Got an unexpected page');
  });
}
//
// WARNING: If this doesn't return any sections, you're ON THE CONFIRMATION PAGE
function mainPageToSectionsOrConfirmation({ formData, ccn }) {
  formData.set('ICAJAX', '0');
  formData.set('ICAction', 'DERIVED_REGFRM1_SSR_PB_ADDTOLIST2$9$');
  formData.set('DERIVED_REGFRM1_CLASS_NBR', ccn.toString());
  formData.set('DERIVED_REGFRM1_SSR_CLS_SRCH_TYPE$249$', '06');

  return postFormData(CART_URL, formData).then(body => parseSectionPage(body));
}

function sectionPageToConfirmation({ formData, selections }) {
  formData.set('ICAJAX', '0');
  formData.set('ICAction', 'DERIVED_CLS_DTL_NEXT_PB');
  for (let i = 0; i < selections.length; i++) {
    const choice = selections[i].toString();
    formData.set(`SSR_CLS_TBL_R${i + 1}$sels$${choice}$$0`, choice);
  }
  return postFormData(CART_URL, formData)
         .then(body => docFromBody(body))
         .then(doc => parseResponse(doc));
}

function confirmationPageToMainPage(formData, permissionNumber = '', graded = true, waitlistOk = false) {
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
    formData.set('DERIVED_CLS_DTL_SSR_GRADE_BASIS_SS$30$', 'EPN');
  }

  return postFormData(CART_URL, formData)
    .then(body => docFromBody(body))
    .then(doc => parseResponse(doc));
}

function reloadMainPage() {
  return fetch(CART_URL, { credentials: 'same-origin' })
    .then(response => response.text())
    .then(body => docFromBody(body))
    .then(doc => parseResponse(doc));
}

export function getSectionsAndAvailabilityForCCN({ ccn }) {
  return (dispatch, getState) => {
    dispatch(requestSections({ ccn }));

    const { alreadyInCart, availability } = sectionsFromLecture({ ccn, state: getState() });
    if (alreadyInCart) {
      return Promise.all([
        dispatch(receiveSections({ ccn, sectionGroups: alreadyInCart })),
        dispatch(receiveSectionAvailability({ ccn, availability })),
      ]);
    }

    const formData = getState().api.formData;
    return mainPageToSectionsOrConfirmation({ formData, ccn })
      .then(({ formData: newFormData, pageName, sectionGroups, availability }) => {
        dispatch(receiveSections({ ccn, sectionGroups }));
        if (pageName === pages.CONFIRMATION_PAGE || pageName === pages.ALT_CONFIRMATION_PAGE) {
          dispatch(receiveSectionAvailability({ ccn, availability }));
          return { formData: newFormData };
        }
        const selections = Array(sectionGroups.length).fill('0');
        return sectionPageToConfirmation({ formData: newFormData, selections })
               .then(({ formData: newerFormData, availability }) => {
                 dispatch(receiveSectionAvailability({ ccn, availability }));
                 return { formData: newerFormData };
               });
      })
      .catch((reason) => {
        if (reason.message.includes('The class number entered is not valid')) {
          dispatch(receiveSectionAvailabilityError({ error: reason.message }));
        } else if (reason.message.includes('This class is already in your Shopping Cart')) {
          dispatch(receiveSectionAvailabilityError({ error: reason.message }));
        } else {
          dispatch(receiveSectionAvailabilityError({ error: reason.message }));
          throw reason;
        }
        return reloadMainPage();
      })
      .then(({ formData: newFormData }) => (
        dispatch(cancelShoppingCartAdd({ formData: newFormData }))
      ));
  };
}


export function cancelShoppingCartAdd({ formData }) {
  return (dispatch) => {
    formData.set('ICAction', 'DERIVED_CLS_DTL_CANCEL_PB');
    return postFormData(CART_URL, formData)
      .then(body => docFromBody(body))
      .then(doc => parseResponse(doc))
      .then(({ formData }) => {
        formData.set('ICAJAX', '0');
        formData.set('ICAction', '#ICCancel');
        formData.set('ICNAVTYPEDROPDWN', '0');
        return postFormData(CART_URL, formData);
      }) /* Returns XML, so we can't parse normally. */
      .then(() => reloadMainPage())
      .then(({ formData }) => dispatch(setFormData({ formData })))
      .then(() => dispatch(canceledCartAdd()));
  };
}

function addToShoppingCart({ ccn, selections, gradingOption, cec, formData }) {
  return mainPageToSectionsOrConfirmation({ ccn, formData })
    .then(({ formData: newFormData, pageName }) => (
      pageName === pages.SECTIONS_PAGE ?
      sectionPageToConfirmation({ formData: newFormData, selections })
      : { formData: newFormData }
    ))
    .then(({ formData: newFormData }) => (
      confirmationPageToMainPage(newFormData, cec, gradingOption === 'graded')
    ));
}

function addFromShoppingCart({ formData, positions, positionToEnroll }) {
  formData.set('ICAJAX', '0');
  formData.set('ICAction', 'DERIVED_REGFRM1_LINK_ADD_ENRL');
  formData.set('DERIVED_REGFRM1_CLASS_NBR', '');
  formData.set('DERIVED_REGFRM1_SSR_CLS_SRCH_TYPE$249$', '06');
  for (let i = 0; i < positions.length; ++i) {
    formData.set(`P_SELECT$chk$${positions[i]}`, 'N');
  }
  formData.set(`P_SELECT$chk$${positionToEnroll}`, 'Y');
  formData.set(`P_SELECT$${positionToEnroll}`, 'Y');

  return postFormData(CART_URL, formData)
    .then(body => {
      const doc = docFromBody(body);
      const newFormData = new FormData(doc.getElementById('SSR_SSENRL_ADD'));
      newFormData.set('ICAJAX', '0');
      newFormData.set('ICAction', 'DERIVED_REGFRM1_SSR_PB_SUBMIT');
      return postFormData(ADD_URL, newFormData);
    })
    .then(() => reloadMainPage());
}

export function addCourse({ ccn, selections, gradingOption, cec }) {
  return (dispatch, getState) => {
    dispatch(requestCourseAdd({ ccn, selections }));

    let addedToShoppingCart;
    const formData = getState().api.formData;
    const shoppingCartCourses = getState().shoppingCart.toJS().courses;
    if (shoppingCartCourses.filter(course => course.id === ccn).length === 1) {
      addedToShoppingCart = Promise.resolve({ formData, shoppingCartCourses });
    } else {
      addedToShoppingCart = addToShoppingCart({ ccn, selections, formData, gradingOption, cec });
    }
    return addedToShoppingCart.then(({ formData, shoppingCartCourses }) => {
      const courses = shoppingCartCourses;
      const selectableCourses = courses.filter(course => course.selectable);
      const positions = selectableCourses.map(course => courses.indexOf(course));
      const courseToAddPos = courses.map(course => course.id).indexOf(ccn);

      return addFromShoppingCart({
        formData,
        positions,
        positionToEnroll: courseToAddPos,
      });
    })
    .then(({ formData, enrolledCourses, shoppingCartCourses }) => {
      dispatch(setFormData({ formData }));
      return dispatch(receiveCourseAdd({ ccn, enrolledCourses, shoppingCartCourses }));
    });
  };
}

function dropFromShoppingCart({ formData, positions, positionToDrop }) {
  formData.set('ICAJAX', '0');
  formData.set('ICAction', 'DERIVED_REGFRM1_SSR_PB_DELETE');
  formData.set('DERIVED_REGFRM1_CLASS_NBR', '');
  formData.set('DERIVED_REGFRM1_SSR_CLS_SRCH_TYPE$249$', '06');
  for (let i = 0; i < positions.length; ++i) {
    formData.set(`P_SELECT$chk$${positions[i]}`, 'N');
  }
  formData.set(`P_SELECT$chk$${positionToDrop}`, 'Y');
  formData.set(`P_SELECT$${positionToDrop}`, 'Y');

  return postFormData(CART_URL, formData)
    .then(body => docFromBody(body))
    .then(doc => parseResponse(doc));
}

export function dropCartCourse({ ccn }) {
  return (dispatch, getState) => {
    dispatch(requestCartDrop({ ccn }));
    const formData = getState().api.formData;
    const courses = getState().shoppingCart.toJS().courses;
    const selectableCourses = courses.filter(course => course.selectable);
    const positions = selectableCourses.map(course => courses.indexOf(course));
    const positionToDrop = courses.map(course => course.id).indexOf(ccn);
    return dropFromShoppingCart({ formData, positions, positionToDrop })
      .then(({ formData, enrolledCourses, shoppingCartCourses }) => {
        dispatch(setFormData({ formData }));
        return dispatch(receiveCartDrop({ ccn, enrolledCourses, shoppingCartCourses }));
      });
  };
}
