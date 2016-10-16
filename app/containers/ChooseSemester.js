import { connect } from 'react-redux';
import ChooseSemester from '../components/ChooseSemester';

const mapStateToProps = (state) => {
  const semester = state.semester.toJS();
  console.log(semester);

  return {
    term: semester.term,
  };
};

export default connect(mapStateToProps)(ChooseSemester);
