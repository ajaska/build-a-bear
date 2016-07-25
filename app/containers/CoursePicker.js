import { connect } from 'react-redux';
import CoursePicker from '../components/CoursePicker';
import { changedCCN, changedDept, changedDeptNumber, clickedAdd, setSelection } from '../actions/coursePicker';

function ccnInCart(state) {
  let courses = state.shoppingCart.toJS().courses;
  let ccn = state.coursePicker.toJS().ccn;
  return courses.filter(course => course.id === ccn).length > 0
}

const mapStateToProps = (state, ownProps) => {
  return Object.assign({},
    state.coursePicker.toJS(),
    { ccnInCart: ccnInCart(state) }
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
    clickedAdd: (things) => {
      dispatch(clickedAdd(things))
    },
    setSelection: (selection) => {
      dispatch(setSelection(selection))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursePicker);
