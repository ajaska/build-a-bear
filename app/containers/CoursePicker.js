import { connect } from 'react-redux';
import CoursePicker from '../components/CoursePicker';
import { changedCCN } from '../actions/coursePicker';

const mapStateToProps = (state, ownProps) => {
  return { coursePicker: state.coursePicker }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changedCCN: (ccn) => {
      dispatch(changedCCN(ccn))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursePicker);
