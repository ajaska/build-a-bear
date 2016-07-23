import { connect } from 'react-redux';
import CoursePicker from '../components/CoursePicker';
import { setCCN } from '../actions/coursePicker';

const mapStateToProps = (state, ownProps) => {
  return { coursePicker: state.coursePicker }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCCN: (ccn) => {
      dispatch(setCCN(ccn))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursePicker);
