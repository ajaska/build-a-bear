import { connect } from 'react-redux';
import UnitSummary from '../components/UnitSummary';

const mapStateToProps = (state, ownProps) => {
  let courses = state.enrolled.toJS().courses;
  let groupedCourses = {};
  for (let i=0; i<courses.length; i++) {
    let deptNumber = courses[i].course.split('-')[0];
    groupedCourses[deptNumber] = groupedCourses[deptNumber] || [];
    groupedCourses[deptNumber].push(courses[i]);
  }
  let ec = Object.keys(groupedCourses)
    .map(key => groupedCourses[key])
    .filter(course => course[0].enrollment_status === 'Enrolled')
    .map(course => course[0].units)
    .reduce((prev, units) => prev + (1*units), 0.0);

  let wc = Object.keys(groupedCourses)
    .map(key => groupedCourses[key])
    .filter(course => course[0].enrollment_status === 'Wait Listed')
    .map(course => course[0].units)
    .reduce((prev, units) => prev + (1*units), 0.0);

  ec = ec || 0;
  wc = wc || 0;

  return { enrolledUnits: ec, waitlistedUnits: wc, maxUnits: 16 }
}

export default connect(mapStateToProps)(UnitSummary);
