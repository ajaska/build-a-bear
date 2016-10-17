import { connect } from 'react-redux';
import SemesterHeader from '../components/SemesterHeader';
import { changedSemester } from '../actions/semester';
import { updateSemesterOptions } from '../actions/api';


const mapStateToProps = (state) => {
  const semesterState = state.semester.toJS();
  let choices = [];
  if (semesterState.choices.length > 0) {
    choices = semesterState.choices;
  }

  return {
    career: semesterState.career,
    choices,
    term: semesterState.term,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateSemesterOptions: () => {
    dispatch(updateSemesterOptions());
  },
  changedSemester: (choice) => {
    dispatch(changedSemester(choice));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SemesterHeader);
