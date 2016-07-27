import { connect } from 'react-redux';
import CoursePicker from '../components/CoursePicker';
import { changedCCN, changedDept, changedDeptNumber, clickedAdd, setSelection, changedLectureSelection } from '../actions/coursePicker';

import { allDepts, deptNumbersForDept } from '../helpers/everything';

function ccnInCart(state) {
  let courses = state.shoppingCart.toJS().courses;
  let ccn = state.coursePicker.toJS().ccn;
  return courses.filter(course => course.id === ccn).length > 0
}

const mapStateToProps = (state, ownProps) => {
  let cpState = state.coursePicker.toJS();
  let lectureSection = cpState.lectureSections[cpState.lectureSection];
  let courseName = "";
  if (lectureSection) {
    courseName = lectureSection.courseName;
  }
  return Object.assign({},
    state.coursePicker.toJS(),
    {
      ccnInCart: ccnInCart(state),
      deptOptions: allDepts().sort(),
      deptNumbers: deptNumbersForDept(cpState.dept),
      courseName: courseName,
    }
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    changedCCN: (ccn) => {
      dispatch(changedCCN(ccn))
    },
    changedDept: (dept) => {
      dispatch(changedDept(dept))
    },
    changedDeptNumber: (deptNumber) => {
      dispatch(changedDeptNumber(deptNumber))
    },
    setSelection: (selection) => {
      dispatch(setSelection(selection))
    },
    changedLectureSelection: (selection) => {
      dispatch(changedLectureSelection(selection))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursePicker);
