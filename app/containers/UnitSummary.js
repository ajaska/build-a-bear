import { connect } from 'react-redux';
import UnitSummary from '../components/UnitSummary';

const mapStateToProps = (state) => {
  const courses = state.enrolled.toJS().courses;

  let ec = courses.map(course => course.lecture)
                  .filter(lecture => lecture.enrollmentStatus === 'Enrolled')
                  .map(lecture => lecture.units)
                  .reduce((prev, units) => prev + (1 * units), 0.0);

  let wc = courses.map(course => course.lecture)
                  .filter(lecture => lecture.enrollmentStatus === 'Wait Listed')
                  .map(lecture => lecture.units)
                  .reduce((prev, units) => prev + (1 * units), 0.0);

  ec = ec || 0;
  wc = wc || 0;

  return {
    enrolledUnits: ec,
    waitlistedUnits: wc,
    maxUnits: 20.5,
  };
};

export default connect(mapStateToProps)(UnitSummary);
