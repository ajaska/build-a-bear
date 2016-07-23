import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

class CoursePicker extends React.Component {
  handleChange(event) {
    this.props.changedCCN({ccn: event.target.value})
  }

  render() {
    return (
      <div>
        <div>
          This is the course picker.
        </div>
        <div>
          <input
            type="text"
            value={this.props.coursePicker.get("ccn")}
            onChange={this.handleChange.bind(this)}
          />
        </div>
        <div>
          The name of this course is {this.props.coursePicker.get("course_name")}.
          {this.props.coursePicker.get("dept")} - {this.props.coursePicker.get("dept_number")}
        </div>
      </div>
    )
  }
}

CoursePicker.propTypes = {
  coursePicker: ImmutablePropTypes.mapContains({
    ccn: React.PropTypes.string.isRequired,
    sections: ImmutablePropTypes.list.isRequired,
    dept: React.PropTypes.string.isRequired,
    dept_number: React.PropTypes.string.isRequired,
    course_name: React.PropTypes.string.isRequired,
  }).isRequired
}

export default CoursePicker;
