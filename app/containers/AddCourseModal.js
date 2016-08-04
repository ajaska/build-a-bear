import { connect } from 'react-redux';
import AddCourseModal from '../components/AddCourseModal';
import { clickedAdd } from '../actions/coursePicker';

const mapStateToProps = (state) => {
  const courses = state.enrolled.toJS().courses;
  const units = courses.map(course => (course.lecture))
                       .reduce((prev, course) => (prev + (1 * course.units)), 0.0);

  const coursePicker = state.coursePicker.toJS();
  const lecture = coursePicker.lectureSections[coursePicker.lectureSection];
  const sections = [];
  for (let i = 0; i < coursePicker.sectionGroups.length; ++i) {
    if (coursePicker.selections[i]) {
      sections.push(coursePicker.sectionGroups[i][coursePicker.selections[i]]);
    }
  }

  const ccnSelection = {
    ccn: coursePicker.ccn,
    selections: coursePicker.selections,
  };

  return {
    beforeUnits: units,
    lecture,
    sections,
    lectureAvailability: coursePicker.lectureAvailability,
    ccnSelection,
    gradingOption: coursePicker.gradingOption,
    cec: coursePicker.cec,
  };
};

const mapDispatchToProps = (dispatch) => ({
  clickedAdd: (things) => (
    dispatch(clickedAdd(things))
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCourseModal);
