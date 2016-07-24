import { connect } from 'react-redux';
import CoursePicker from '../components/CoursePicker';
import { changedCCN, clickedAdd, setSelection } from '../actions/coursePicker';

const mapStateToProps = (state, ownProps) => {
  return { coursePicker: state.coursePicker }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changedCCN: (ccn) => {
      dispatch(changedCCN(ccn))
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
