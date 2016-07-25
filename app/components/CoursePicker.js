import React, { PropTypes } from 'react';

class CoursePicker extends React.Component {
  handleCCNChange(event) {
    this.props.changedCCN({ccn: event.target.value})
  }

  handleDeptChange(event) {
    this.props.changedDept({dept: event.target.value})
  }

  handleDeptNumberChange(event) {
    this.props.changedDeptNumber({deptNumber: event.target.value})
  }

  handleSelector(event) {
    this.props.setSelection({selection: event.target.value})
  }

  clickedAdd(event) {
    event.preventDefault();
    this.props.clickedAdd({
      ccn: this.props.ccn,
      selection: this.props.selection,
    });
  }

  render() {
    let sections;
    if(this.props.sections.length > 0) {
      sections = this.props.sections.map((section, i) => {
        return (
          <option value={i} key={i}>
            Section choice {i}: {section.id} | {section.time} | {section.room} | {section.instructor} | {section.availability}
          </option>
        )
      });
      sections = (
        <select
          value={this.props.selection}
          onChange={this.handleSelector.bind(this)} >
          { sections }
        </select>
      );
    } else if (this.props.isLoadingSections) {
      sections = <div>Loadingu</div>
    } else if (this.props.ccn
               && this.props.deptNumber
               && this.props.dept) {
      sections = <div>Neato, no sections for this guy</div>
    } else {
      sections = <div>Waiting for course selection ^_^</div>
    }
    return (
      <div>
        <div>
          This is the course picker.
        </div>
        <form onSubmit={this.clickedAdd.bind(this)}>
          <div>
            <input
              type="text"
              value={this.props.ccn}
              onChange={this.handleCCNChange.bind(this)}
            />
          </div>
          <div>
            The name of this course is {this.props.courseName}.
            <input
              type="text"
              value={this.props.dept}
              onChange={this.handleDeptChange.bind(this)}
            />
            -
            <input
              type="text"
              value={this.props.deptNumber}
              onChange={this.handleDeptNumberChange.bind(this)}
            />
          <div>{this.props.deptOptions.join(", ")}</div>
          <div>{this.props.deptNumbers.join(", ")}</div>
          </div>
          <div> Available sections:
            {sections}
          </div>
          { this.props.ccnInCart && <div>Already in the cart, dummy</div> }
          <input type="submit" value="Add" />
        </form>
      </div>
    )
  }
}

CoursePicker.propTypes = {
  ccn: React.PropTypes.string.isRequired,
  sections: React.PropTypes.array.isRequired,
  isLoadingSections: React.PropTypes.bool.isRequired,
  dept: React.PropTypes.string.isRequired,
  deptNumber: React.PropTypes.string.isRequired,
  deptOptions: React.PropTypes.array.isRequired,
  deptNumbers: React.PropTypes.array.isRequired,
  courseName: React.PropTypes.string.isRequired,
  selection: React.PropTypes.string.isRequired,
}

export default CoursePicker;
