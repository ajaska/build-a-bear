import { connect } from 'react-redux';
import EnrolledCourses from '../components/EnrolledCourses';

const mapStateToProps = (state) => {
  const courses = state.enrolled.toJS().courses;
  const groupedCourses = {};
  for (let i = 0; i < courses.length; i++) {
    const deptNumber = courses[i].course.split('-')[0];
    groupedCourses[deptNumber] = groupedCourses[deptNumber] || [];
    groupedCourses[deptNumber].push(courses[i]);
  }
  return { courses: groupedCourses };
};

export default connect(mapStateToProps)(EnrolledCourses);
