import { connect } from 'react-redux';
import Calendar from '../components/Calendar';
import { flatten } from '../helpers/flatten';

const mapStateToProps = (state) => {
  const courses = flatten(state.enrolled.toJS().courses
                          .map(course => course.flatten()));
  let normalizedCourses = [];
  for (let i = 0; i < courses.length; i++) {
    const time = courses[i].time;
    const waitlisted = courses[i].enrollmentStatus === 'Wait Listed';
    const lecture = courses[i].type === 'Lecture';
    normalizedCourses = normalizedCourses.concat(time.daysArray.map(day => ({
      desc: courses[i].courseName,
      room: courses[i].room,
      day,
      start: time.start,
      length: time.end - time.start,
      formatted: time.toString().split(/ (.+)?/)[1],
      lecture,
      waitlisted,
    })));
  }
  return { courses: normalizedCourses };
};

export default connect(mapStateToProps)(Calendar);
