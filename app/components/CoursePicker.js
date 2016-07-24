import React, { PropTypes } from 'react';

class CoursePicker extends React.Component {
  handleChange(event) {
    this.props.changedCCN({ccn: event.target.value})
  }

  handleSelector(event) {
    this.props.setSelection({selection: event.target.value})
  }

  clickedAdd(event) {
    event.preventDefault();
    this.props.clickedAdd({
      ccn: this.props.coursePicker.ccn,
      selection: this.props.coursePicker.selection,
    });
  }

  render() {
    let sections = this.props.coursePicker.sections.map((section, i) => {
      return (
        <option value={i} key={i}>
          Section choice {i}: {section.id} | {section.time} | {section.room} | {section.instructor} | {section.availability}
        </option>
      )
    });
    return (
      <div>
        <div>
          This is the course picker.
        </div>
        <form onSubmit={this.clickedAdd.bind(this)}>
          <div>
            <input
              type="text"
              value={this.props.coursePicker.ccn}
              onChange={this.handleChange.bind(this)}
            />
          </div>
          <div>
            The name of this course is {this.props.coursePicker.course_name}.
            {this.props.coursePicker.dept} - {this.props.coursePicker.dept_number}
          </div>
          <div> Available sections:
            <select
              value={this.props.coursePicker.selection}
              onChange={this.handleSelector.bind(this)} >
              { sections }
            </select>
          </div>
          <input type="submit" value="Add" />
        </form>
      </div>
    )
  }
}

CoursePicker.propTypes = {
  coursePicker: React.PropTypes.shape({
    ccn: React.PropTypes.string.isRequired,
    sections: React.PropTypes.array.isRequired,
    dept: React.PropTypes.string.isRequired,
    dept_number: React.PropTypes.string.isRequired,
    course_name: React.PropTypes.string.isRequired,
    selection: React.PropTypes.string.isRequired,
  }).isRequired
}

export default CoursePicker;
