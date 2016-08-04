import { connect } from 'react-redux';
import EnrolledCourses from '../components/EnrolledCourses';

const mapStateToProps = (state) => {
  const courses = state.enrolled.toJS().courses;
  return { courses };
};

export default connect(mapStateToProps)(EnrolledCourses);
