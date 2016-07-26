import React from 'react';

class AddCourseModal extends React.Component {
  handleAddClicked(event) {
    event.preventDefault();
    this.props.clickedAdd(this.props.ccnSelection);
  }
  
  render() {
    if (!this.props.lecture || !this.props.discussion) {
      return <div className="ui modal add-course-confirm"></div>;
    }
    let lecture = this.props.lecture;
    let lectureHeader= `${lecture.dept} ${lecture.deptNumber}-${lecture.section} LEC`;
    let discussion = this.props.discussion;
    let discussionHeader= `${lecture.dept} ${lecture.deptNumber}-${discussion.section} DISC`;
    let lectureWaitlist;
    if (this.props.lectureAvailability) {
      lectureWaitlist = <span>You will be <span className="color-blue">on the waitlist</span>.</span>;
    }
    return (
      <div className="ui modal add-course-confirm">
        <div className="modal-header clearfix">
            <span className="modal-header-text">Add Class Confirmation</span><span className="modal-cancel"><i id="add-close" className="modal-cancel-icon remove icon"></i></span>
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
          <div className="modal-class-item">
            <span className="modal-course-info-name semibold">{ discussionHeader }</span>
            <div className="modal-course-info">
              <div className="modal-course-info">
                <span>
                  <span className="semibold"> {discussion.room} </span> | { discussion.time }<br />
                  Instructor: <span className="semibold">{ discussion.instructor }</span><br />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <span className="modal-confirm-text">You will have <span className="color-blue">{ (1*lecture.units) + this.props.beforeUnits }</span> total units.<button className="modal-confirm-button" onClick={this.handleAddClicked.bind(this)}>Confirm</button></span>
        </div>
      </div>
    )
  }
}

export default AddCourseModal;
