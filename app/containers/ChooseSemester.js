import { connect } from 'react-redux';
import ChooseSemester from '../components/ChooseSemester';
import { setSemester } from '../actions/api';

const mapStateToProps = (state) => {
  const semester = state.semester.toJS();

  return {
    choices: semester.choices,
    term: semester.term,
  };
};

const mapDispatchToProps = (dispatch) => ({
  selectedSemester: (term) => {
    dispatch(setSemester(term));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChooseSemester);
