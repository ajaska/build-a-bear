import { connect } from 'react-redux';

import Calendar from '../components/ToGoogleCalendar';
import { coursesToCal } from '../lib/ICSGenerator';

const mapStateToProps = (state) => {
  const courses = state.enrolled.toJS().courses;
  const calendarFileBody = coursesToCal(courses);
  console.log(calendarFileBody);
  console.log("wtf");
  return {
    calendarFileBody,
  }
};

export default connect(mapStateToProps)(ToGoogleCalendar);
