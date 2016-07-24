import { connect } from 'react-redux';
import CoursePicker from '../components/CoursePicker';
import { changedCCN, clickedAdd } from '../actions/coursePicker';

const mapStateToProps = (state, ownProps) => {
  return { coursePicker: state.coursePicker }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changedCCN: (ccn) => {
      dispatch(changedCCN(ccn))
    },
    clickedAdd: (ccn) => {
      dispatch(clickedAdd(ccn))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursePicker);
