import { connect } from 'react-redux';
import CoursePicker from '../components/CoursePicker';
import { changedCCN, changedDept, changedDeptNumber,
         setSelection, changedLectureSelection, setGradingOption,
         setCEC } from '../actions/coursePicker';

import { allDepts, deptNumbersForDept } from '../helpers/everything';

function ccnInCart(state) {
  const courses = state.shoppingCart.toJS().courses;
  const ccn = state.coursePicker.toJS().ccn;
  return courses.filter(course => course.id === ccn).length > 0;
}

function checkWarning(state, lectureSection) {
  if (ccnInCart(state)) {
    return 'If you want to enroll in a different section, you must drop the ' +
           'class from your cart and re-add it here.';
  }

  const courses = state.enrolled.toJS().courses;
  const unitCount = courses
    .filter(course => course.units > 0)
    .map(course => course.units)
    .reduce((prev, units) => prev + (1 * units), 0.0);
  if (lectureSection && unitCount && ((1 * lectureSection.units) + unitCount > 16)) {
    return 'Adding this course would put you over the 16 unit cap.';
  }
  return '';
}

const mapStateToProps = (state) => {
  const cpState = state.coursePicker.toJS();
  const lectureSection = cpState.lectureSections[cpState.lectureSection];
  let courseName = '';
  if (lectureSection) {
    courseName = lectureSection.courseName;
  }

  const warning = checkWarning(state, lectureSection);

  return Object.assign({},
    state.coursePicker.toJS(),
    {
      ccnInCart: ccnInCart(state),
      deptOptions: allDepts().sort(),
      deptNumbers: deptNumbersForDept(cpState.dept),
      courseName,
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
