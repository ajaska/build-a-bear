import { connect } from 'react-redux';
import MainPage from '../components/MainPage';

const mapStateToProps = (state) => {
  const semester = state.semester.toJS();
  return {
    term: semester.term,
  };
};

export default connect(mapStateToProps)(MainPage);
