import React from 'react';

class AddCourseModal extends React.Component {
  handleClose(event) {
    $('.add-course-confirm').modal('hide');
  }

  handleAddClicked(event) {
    event.preventDefault();
    this.props.clickedAdd(this.props.ccnSelections);
  }
  
  render() {
    if (!this.props.lecture) {
      return <div className="ui modal add-course-confirm"></div>;
    }
    let lecture = this.props.lecture;
    let lectureHeader= `${lecture.dept} ${lecture.deptNumber}-${lecture.section} LEC`;
    let sections = this.props.sections.map((section, i) => (
      <div className="modal-class-item" key={i}>
        <span className="modal-course-info-name semibold">{ `${lecture.dept} ${lecture.deptNumber}-${section.section}` }</span>
        <div className="modal-course-info">
          <div className="modal-course-info">
            <span>
              <span className="semibold"> { section.room} </span> | { section.time }<br />
              Instructor: <span className="semibold">{ section.instructor }</span><br />
            </span>
          </div>
        </div>
      </div>
    ));
    let lectureWaitlist;
    if (this.props.lectureAvailability) {
      lectureWaitlist = <span>You will be <span className="color-blue">on the waitlist</span>.</span>;
    }
    return (
      <div className="ui modal add-course-confirm">
        <div className="modal-header clearfix" onClick={this.handleClose.bind(this)}>
            <span className="modal-header-text">Add Class Confirmation</span>
            <span className="modal-cancel"><i id="add-close" className="modal-cancel-icon remove icon"></i></span>
        </div>
        <p className="modal-confirm-text">Are you sure you want to add:</p>
        <div className="modal-body">
          <div className="modal-class-item">
            <span className="modal-course-info-name semibold">{ lectureHeader } <span className="color-blue">({lecture.units} Units)</span></span>
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
          <span className="modal-confirm-text">You will have <span className="color-blue">{ (1*lecture.units) + this.props.beforeUnits }</span> total units.<button className="modal-confirm-button" onClick={this.handleAddClicked.bind(this)}>Confirm</button></span>
        </div>
      </div>
    )
  }
}

export default AddCourseModal;
