import { connect } from 'react-redux';
import CoursePicker from '../components/CoursePicker';
import { changedCCN, changedDept, changedDeptNumber, clickedAdd, setSelection } from '../actions/coursePicker';

const mapStateToProps = (state, ownProps) => {
  return { coursePicker: state.coursePicker.toJS() }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changedCCN: (ccn) => {
      dispatch(changedCCN(ccn))
    },
    changedDept: (dept) => {
      dispatch(changedDept(dept))
    },
    changedDeptNumber: (dept_number) => {
      dispatch(changedDeptNumber(dept_number))
    },
    clickedAdd: (things) => {
      dispatch(clickedAdd(things))
    },
    setSelection: (selection) => {
      dispatch(setSelection(selection))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursePicker);
