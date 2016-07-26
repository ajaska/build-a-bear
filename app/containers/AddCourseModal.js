import { connect } from 'react-redux';
import AddCourseModal from '../components/AddCourseModal';
import { clickedAdd } from '../actions/coursePicker';

const mapStateToProps = (state, ownProps) => {
  let courses = state.enrolled.toJS().courses;
  let units = courses.reduce((prev, course) => course.units ? prev+(1*course.units) : prev, 0.0);

  let coursePicker = state.coursePicker.toJS();
  let lecture = coursePicker.lectureSections[coursePicker.lectureSection];
  let discussion = coursePicker.sections[coursePicker.selection];

  let ccnSelection = {
    ccn: coursePicker.ccn,
    selection: coursePicker.selection,
  };

  return {
    beforeUnits: units,
    lecture: lecture,
    discussion: discussion,
    lectureAvailability: coursePicker.lectureAvailability,
    ccnSelection: ccnSelection,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clickedAdd: (things) => {
      dispatch(clickedAdd(things))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCourseModal);
