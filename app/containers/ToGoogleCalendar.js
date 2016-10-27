import { connect } from 'react-redux';

import ToGoogleCalendar from '../components/ToGoogleCalendar';
import { coursesToCal } from '../lib/ICSGenerator';

const mapStateToProps = (state) => {
  const courses = state.enrolled.toJS().courses;
  const calendarFileBody = coursesToCal(courses);
  return {
    calendarFileBody,
  };
};

export default connect(mapStateToProps)(ToGoogleCalendar);
