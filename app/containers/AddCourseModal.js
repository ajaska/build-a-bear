import { connect } from 'react-redux';
import AddCourseModal from '../components/AddCourseModal';
import { clickedAdd } from '../actions/coursePicker';

const mapStateToProps = (state, ownProps) => {
  let courses = state.enrolled.toJS().courses;
  let units = courses.reduce((prev, course) => course.units ? prev+(1*course.units) : prev, 0.0);

  let coursePicker = state.coursePicker.toJS();
  let lecture = coursePicker.lectureSections[coursePicker.lectureSection];
  let sections = [];
  for (let i=0; i<coursePicker.sectionGroups.length; ++i) {
    sections.push(coursePicker.sectionGroups[i][coursePicker.selections[i]]);
  }

  let ccnSelection = {
    ccn: coursePicker.ccn,
    selections: coursePicker.selections,
  };

  return {
    beforeUnits: units,
    lecture: lecture,
    sections: sections,
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
