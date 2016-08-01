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

const mapStateToProps = (state) => {
  const cpState = state.coursePicker.toJS();
  let lectureSelection = cpState.lectureSection;
  if (cpState.lectureSections.length === 1) {
    lectureSelection = '0';
  }
  const lectureSection = cpState.lectureSections[lectureSelection];
  let courseName = '';
  if (lectureSection) {
    courseName = lectureSection.courseName;
  }
  return Object.assign({},
    state.coursePicker.toJS(),
    {
      ccnInCart: ccnInCart(state),
      deptOptions: allDepts().sort(),
      deptNumbers: deptNumbersForDept(cpState.dept),
      courseName,
      lectureSection: lectureSelection,
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
