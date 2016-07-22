import { parseDiscussionTable, parseShoppingCartTable } from './tableParsers'
import { postFormData } from './forms';


export function getSectionsForCCN(ccn, formData) {
  let url = 'https://bcsweb.is.berkeley.edu/psc/bcsprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES_2.SSR_SSENRL_CART.GBL';
  formData.set('ICAJAX', '0');
  formData.set('ICAction', 'DERIVED_REGFRM1_SSR_PB_ADDTOLIST2$9$');
  formData.set('DERIVED_REGFRM1_CLASS_NBR', ccn.toString());
  formData.set('DERIVED_REGFRM1_SSR_CLS_SRCH_TYPE$249$', '06');

  return postFormData(url, formData).then(function(body) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(body, "text/html");
    let rows = doc.querySelectorAll("tr [id^='trSSR_CLS_TBL']");
    let sections = parseDiscussionTable(rows);
    let newForm = doc.getElementById('SSR_SSENRL_CART');
    let newFormData = new FormData(newForm);
    return { formData: newFormData, sections: sections }
  });
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
