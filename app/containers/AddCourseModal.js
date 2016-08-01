import { connect } from 'react-redux';
import AddCourseModal from '../components/AddCourseModal';
import { clickedAdd } from '../actions/coursePicker';

const mapStateToProps = (state) => {
  const courses = state.enrolled.toJS().courses;
  const units = courses.reduce((prev, course) => (
    course.units ? prev + (1 * course.units) : prev)
  , 0.0);

  const coursePicker = state.coursePicker.toJS();
  let lectureSelection = coursePicker.lectureSection;
  if (coursePicker.lectureSections.length === 1) {
    lectureSelection = '0';
  }
  const lecture = coursePicker.lectureSections[lectureSelection];
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
