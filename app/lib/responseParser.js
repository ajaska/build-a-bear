import {
  parseEnrolledCoursesTable,
  parseShoppingCartTable,
  parseDiscussionTable,
  parseSemesterSelectionTable,
} from './tableParsers';

export const pages = {
  MAIN_PAGE: 'SSR_SSENRL_CART',
  SECTIONS_PAGE: 'SSR_CLS_RELCOMP',
  CONFIRMATION_PAGE: 'SSR_SSENRL_ADD_C',
  ALT_CONFIRMATION_PAGE: 'SSR_CLS_DTLOPT',
  CANCEL_PAGE: 'SSR_SS_SAVEWARNING',
  SEMESTER_SELECTION_PAGE: 'SSR_SSENRL_TERM',
};

function doEnrolledTable(doc) {
  const enrolledTableRows = doc.querySelectorAll("tr [id^='trSTDNT_ENRL_SSVW']");
  if (enrolledTableRows.length === 0) {
    return [];
  }
  return parseEnrolledCoursesTable(enrolledTableRows);
}

function doShoppingCartTable(doc) {
  const shoppingCartTableRows = doc.querySelectorAll("tr [id^='trSSR_REGFORM_VW']");
  if (shoppingCartTableRows.length === 0
      || shoppingCartTableRows[0].innerText.includes('shopping cart is empty')) {
    return [];
  }
  return parseShoppingCartTable(shoppingCartTableRows);
}

function doSectionTables(doc) {
  const sectionTables = doc.querySelectorAll("table[id^='SSR_CLS_TBL_R']");
  const sectionTypes = sectionTables.length;

  const sectionGroups = [];
  for (let i = 0; i < sectionTypes; ++i) {
    const rows = doc.querySelectorAll(`tr [id^='trSSR_CLS_TBL_R${i + 1}']`);
    sectionGroups.push(parseDiscussionTable(rows));
  }

  return sectionGroups;
}

function doAvailability(doc) {
  const availabilityDiv = doc.querySelector('[id^="win0divDERIVED_CLS_DTL_SSR_DESCRSHORT$0"]');
  if (!availabilityDiv) {
    throw new Error('No availability div found');
  }

  let availability = 'Unknown';
  if (availabilityDiv.innerText.includes('Open')) {
    availability = 'Open';
  } else if (availabilityDiv.innerText.includes('Wait List')) {
    availability = 'Wait List';
  } else if (availabilityDiv.innerText.includes('Closed')) {
    availability = 'Closed';
  }
  return availability;
}

function doSemesterSelection(doc) {
  const semesterRows = doc.querySelectorAll("tr [id^='trSSR_DUMMY_RECV']");
  if (!semesterRows) {
    throw new Error('No semester selection div found');
  }
  return parseSemesterSelectionTable(semesterRows);
}

function doCurrentSemester(doc) {
  const semesterInfo = doc.querySelector('span[id^="DERIVED_REGFRM1_SSR_STDNTKEY_DESCR"]');
  if (!semesterInfo) {
    throw new Error('No semester info found');
  }

  const splitSemesterInfo = semesterInfo.textContent.trim().split(' | ');
  if (splitSemesterInfo.length !== 3) {
    throw new Error('Semester info unparseable');
  }

  return {
    term: splitSemesterInfo[0],
    career: splitSemesterInfo[1],
  };
}

export function parseResponse(doc) {
  /* Every page */
  const info = {};

  const pageInfo = doc.getElementById('pt_pageinfo_win0');
  if (!pageInfo || !pageInfo.attributes || !pageInfo.attributes.page) {
    console.error(doc);
    throw new Error('Couldn\'t find page info!');
  }

  info.pageName = pageInfo.attributes.page.value;
  info.formData = new FormData(doc.getElementById('SSR_SSENRL_CART'));

  const warning = doc.querySelector('.SSSMSGWARNINGTEXT');
  if (warning && info.pageName !== pages.CANCEL_PAGE) {
    throw new Error(warning.innerText);
  }

  /* Page specific handlers */
  switch (info.pageName) {
    case pages.SEMESTER_SELECTION_PAGE:
      info.semester = doSemesterSelection(doc);
      break;
    case pages.MAIN_PAGE:
      info.enrolledCourses = doEnrolledTable(doc);
      info.shoppingCartCourses = doShoppingCartTable(doc);
      Object.assign(info, doCurrentSemester(doc));
      break;
    case pages.SECTIONS_PAGE:
      info.sectionGroups = doSectionTables(doc);
      break;
    case pages.CONFIRMATION_PAGE:
    case pages.ALT_CONFIRMATION_PAGE:
      info.availability = doAvailability(doc);
      break;
    case pages.CANCEL_PAGE:
      break;
    default:
      throw new Error('Dont know how to parse this page!');
  }

  return info;
}
