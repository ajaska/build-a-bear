import { connect } from 'react-redux';
import EnrolledCourses from '../components/EnrolledCourses';

const mapStateToProps = (state, ownProps) => {
  return { courses: state.enrolled.get('courses') }
}

export default connect(mapStateToProps)(EnrolledCourses);
