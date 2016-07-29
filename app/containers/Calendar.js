import { connect } from 'react-redux';
import Calendar from '../components/Calendar';

function parseTime(timeString) {
  const re = /((?:Mo|Tu|We|Th|Fr|Sa|Su)+) (\d?\d:\d\d)(AM|PM) - (\d?\d:\d\d)(AM|PM)/;

  const matches = timeString.match(re);
  if (!matches || matches.length !== 6) {
    console.error(`Failed to parseDate: ${timeString}`);
    return [];
  }
  const [days, startTime, startAM, endTime, endAM] = matches.slice(1);

  let start = parseInt(startTime.replace(':', ''), 10);
  if (Math.floor(start / 100) !== 12 && startAM === 'PM') {
    start = start + 1200;
  }
  let end = parseInt(endTime.replace(':', ''), 10);
  if (Math.floor(end / 100) !== 12 && endAM === 'PM') {
    end = end + 1200;
  }
  if (end % 10 === 9) {
    end = end + 1;
  }
  const length = end - start;

  const daysArray = days.match(/\w\w/g);
  if (!daysArray) {
    console.error(`Failed to parse days for Date: ${timeString}`);
    return [];
  }
  return daysArray.map(day => ({
    day,
    start,
    length,
  }));
}

const mapStateToProps = (state) => {
  const courses = state.enrolled.toJS().courses;
  let normalizedCourses = [];
  for (let i = 0; i < courses.length; i++) {
    const times = parseTime(courses[i].time);
    const waitlisted = courses[i].enrollment_status === 'Wait Listed';
    const lecture = courses[i].type === 'Lecture';
    normalizedCourses = normalizedCourses.concat(times.map(time => ({
      desc: courses[i].course,
      room: courses[i].room,
      day: time.day,
      start: time.start,
      length: time.length,
      lecture,
      waitlisted,
    })));
  }
  return { courses: normalizedCourses };
};

export default connect(mapStateToProps)(Calendar);
