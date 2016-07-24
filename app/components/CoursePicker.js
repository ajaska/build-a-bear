import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

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
      ccn: this.props.coursePicker.get('ccn'),
      selection: this.props.coursePicker.get('selection'),
    });
  }

  render() {
    let sections = this.props.coursePicker.get('sections').toJS().map((section, i) => {
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
              value={this.props.coursePicker.get("ccn")}
              onChange={this.handleChange.bind(this)}
            />
          </div>
          <div>
            The name of this course is {this.props.coursePicker.get("course_name")}.
            {this.props.coursePicker.get("dept")} - {this.props.coursePicker.get("dept_number")}
          </div>
          <div> Available sections:
            <select
              value={this.props.coursePicker.get('selection')}
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
  coursePicker: ImmutablePropTypes.mapContains({
    ccn: React.PropTypes.string.isRequired,
    sections: ImmutablePropTypes.list.isRequired,
    dept: React.PropTypes.string.isRequired,
    dept_number: React.PropTypes.string.isRequired,
    course_name: React.PropTypes.string.isRequired,
    selection: React.PropTypes.string.isRequired,
  }).isRequired
}

export default CoursePicker;
