import { connect } from 'react-redux';
import Calendar from '../components/Calendar';

function timeToInt(time, am) {
  let timeInt = parseInt(time.replace(':', ''), 10);
  if (!am && Math.floor(timeInt / 100) !== 12) {
    timeInt = timeInt + 1200;
  }
  if (timeInt % 10 === 9) {
    timeInt = timeInt + 1;
  }
  if (timeInt % 100 === 60) {
    timeInt = timeInt + 100 - 60;
  }
  return timeInt;
}

function prettyTime(start, startAM, end, endAM) {
  const startHour = (Math.floor(start / 100) - 1) % 12 + 1;
  const startMin = start % 100;
  const endHour = (Math.floor(end / 100) - 1) % 12 + 1;
  const endMin = end % 100;

  let startString;
  if (startMin === 0) {
    startString = `${startHour}`;
  } else {
    startString = `${startHour}:${startMin}`;
  }

  let endString;
  if (endMin === 0) {
    endString = `${endHour}`;
  } else {
    endString = `${endHour}:${endMin}`;
  }

  if (startAM === endAM) {
    return `${startString}-${endString} ${endAM}`;
  }
  return `${startString} ${startAM} - ${endString} ${endAM}`;
}

function parseTime(timeString) {
  const re = /((?:Mo|Tu|We|Th|Fr|Sa|Su)+) (\d?\d:\d\d)(AM|PM) - (\d?\d:\d\d)(AM|PM)/;

  const matches = timeString.match(re);
  if (!matches || matches.length !== 6) {
    console.error(`Failed to parseDate: ${timeString}`);
    return [];
  }
  const [days, startTime, startAM, endTime, endAM] = matches.slice(1);

  const start = timeToInt(startTime, startAM === 'AM');
  let end = timeToInt(endTime, endAM === 'AM');
  if (end % 10 === 9) {
    end = end + 1;
  }
  if (end % 100 == 30) {
    end = end + 20;
  }
  const length = end - start;
  const formatted = prettyTime(start, startAM, end, endAM);

  const daysArray = days.match(/\w\w/g);
  if (!daysArray) {
    console.error(`Failed to parse days for Date: ${timeString}`);
    return [];
  }
  return daysArray.map(day => ({
    day,
    formatted,
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
      formatted: time.formatted,
      lecture,
      waitlisted,
    })));
  }
  return { courses: normalizedCourses };
};

export default connect(mapStateToProps)(Calendar);
