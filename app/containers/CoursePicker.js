import { connect } from 'react-redux';
import CoursePicker from '../components/CoursePicker';
import { changedCCN, changedDept, changedDeptNumber,
         setSelection, changedLectureSelection, setGradingOption,
         setCEC } from '../actions/coursePicker';

import { allDepts, deptNumbersForDept } from '../helpers/everything';

function ccnInCart(state) {
  const courses = state.shoppingCart.toJS().courses;
  const ccn = state.coursePicker.toJS().ccn;
  return courses.filter(course => course.lecture.ccn === ccn).length > 0;
}

function checkError(state, lectureSection) {
  const courses = state.enrolled.toJS().courses;
  const unitCount = courses.map(course => course.lecture.units)
                           .reduce((prev, units) => prev + (1 * units), 0.0);

  if (courses.length === 4 || unitCount >= 16) {
    return 'You are already at the unit cap';
  }

  const term = state.semester.toJS().term;
  let maxUnits = 10.5;
  // TODO: remove this hack
  if (term.includes('Fall')) {
    maxUnits = 20.5;
  }

  if (lectureSection && unitCount && ((1 * lectureSection.units) + unitCount > maxUnits)) {
    return 'Adding this course would put you over the unit cap.';
  }

  const cpState = state.coursePicker.toJS();
  if (cpState.ccn.length === 5 && !cpState.lectureSections) {
    return 'Unknown CCN';
  }

  return '';
}

function checkWarning(state) {
  if (ccnInCart(state)) {
    return 'If you want to enroll in a different section, you must drop the ' +
           'class from your cart and re-add it here.';
  }

  return '';
}

const mapStateToProps = (state) => {
  const cpState = state.coursePicker.toJS();
  const lectureSection = cpState.lectureSections[cpState.lectureSection];
  let desc = '';
  if (lectureSection) {
    desc = lectureSection.desc;
  }

  const warning = checkWarning(state, lectureSection);
  const error = cpState.error || checkError(state, lectureSection);
  const isClosed = cpState.lectureAvailability === 'Closed';

  return Object.assign({},
    state.coursePicker.toJS(),
    {
      ccnInCart: ccnInCart(state),
      deptOptions: allDepts().sort(),
      deptNumbers: deptNumbersForDept(cpState.dept),
      desc,
      error,
      isClosed,
      warning,
    }
  );
};

const mapDispatchToProps = (dispatch) => ({
  changedCCN: (ccn) => {
    dispatch(changedCCN(ccn));
  },
  changedDept: (dept) => {
    dispatch(changedDept(dept));
  },
  changedDeptNumber: (deptNumber) => {
    dispatch(changedDeptNumber(deptNumber));
  },
  setSelection: (selection) => {
    dispatch(setSelection(selection));
  },
  changedLectureSelection: (selection) => {
    dispatch(changedLectureSelection(selection));
  },
  setGradingOption: (option) => {
    dispatch(setGradingOption(option));
  },
  setCEC: (cec) => {
    dispatch(setCEC(cec));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CoursePicker);
