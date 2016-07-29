import React from 'react';
import $ from 'jquery';

class AddCourseModal extends React.Component {
  constructor(props) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
    this.handleAddClicked = this.handleAddClicked.bind(this);
  }

  handleClose() {
    $('.add-course-confirm').modal('hide');
  }

  handleAddClicked(event) {
    event.preventDefault();
    this.props.clickedAdd(this.props.ccnSelection);
    $('.add-course-confirm').modal('hide');
  }

  render() {
    if (!this.props.lecture) {
      return <div className="ui modal add-course-confirm"></div>;
    }
    const lecture = this.props.lecture;
    /* eslint-disable space-infix-ops, react/jsx-curly-spacing */
    let lectureHeader= `${lecture.dept} ${lecture.deptNumber}-${lecture.section} LEC`;
    let sections = this.props.sections.map((section, i) => (
      <div className="modal-class-item" key={i}>
        <span className="modal-course-info-name semibold">
          { `${lecture.dept} ${lecture.deptNumber}-${section.section}` }
        </span>
        <div className="modal-course-info">
          <div className="modal-course-info">
            <span>
              <span className="semibold">{ section.room }</span> | { section.time }<br />
              Instructor: <span className="semibold">{ section.instructor }</span><br />
            </span>
          </div>
        </div>
      </div>
    ));
    /* eslint-enable space-infix-ops */
    let lectureWaitlist;
    if (this.props.lectureAvailability.includes('Wait List')) {
      lectureWaitlist = (
        <span>You will be
          <span className="color-blue">on the waitlist</span>.
        </span>
      );
    }
    return (
      <div className="ui modal add-course-confirm">
        <div className="modal-header headerfix" onClick={this.handleClose}>
          <span className="modal-header-text">Add Class Confirmation</span>
          <span className="modal-cancel">
            <i id="add-close" className="modal-cancel-icon remove icon"></i>
          </span>
        </div>
        <p className="modal-confirm-text">Are you sure you want to add:</p>
        <div className="modal-body">
          <div className="modal-class-item">
            <span className="modal-course-info-name semibold">
              { lectureHeader } <span className="color-blue">({lecture.units} Units)</span></span>
            <div className="modal-course-info">
              <div className="modal-course-info">
                <span>
                  <span className="semibold color-blue">{ lecture.courseName }</span><br />
                  <span className="semibold">{ lecture.room }</span> | { lecture.time }<br />
                  Instructor: <span className="semibold">{ lecture.instructor }</span><br />
                  Grading Option: <span className="semibold">P/NP</span><br />
                  { lectureWaitlist }
                </span>
              </div>
            </div>
          </div>
          { sections }
        </div>

        <div className="modal-footer">
          <span className="modal-confirm-text">
            You will have
            <span className="color-blue">{ (1 * lecture.units) + this.props.beforeUnits }</span>
            total units.
            <button className="modal-confirm-button" onClick={this.handleAddClicked}>
              Confirm
            </button>
          </span>
        </div>
      </div>
    );
  }
}

AddCourseModal.propTypes = {
  clickedAdd: React.PropTypes.func.isRequired,
  ccnSelection: React.PropTypes.shape({
    ccn: React.PropTypes.string.isRequired,
    selections: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  }),
  lecture: React.PropTypes.shape({
    dept: React.PropTypes.string.isRequired,
    deptNumber: React.PropTypes.string.isRequired,
    section: React.PropTypes.string.isRequired,
    courseName: React.PropTypes.string.isRequired,
    units: React.PropTypes.string.isRequired,
    room: React.PropTypes.string.isRequired,
    time: React.PropTypes.string.isRequired,
    instructor: React.PropTypes.string.isRequired,
  }),
  lectureAvailability: React.PropTypes.string,
  sections: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      section: React.PropTypes.string.isRequired,
      time: React.PropTypes.string.isRequired,
      room: React.PropTypes.string.isRequired,
      instructor: React.PropTypes.string.isRequired,
      availability: React.PropTypes.string.isRequired,
    })
  ),
  beforeUnits: React.PropTypes.number,
};

export default AddCourseModal;
