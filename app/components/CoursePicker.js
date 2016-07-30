import React from 'react';
import Select from 'react-select';
import $ from 'jquery'; // eslint-disable-line import/no-unresolved

import { alphanumSort } from '../helpers/sort';

class CoursePicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleCCNChange = this.handleCCNChange.bind(this);
    this.handleSelector = this.handleSelector.bind(this);
    this.handleLectureSelector = this.handleLectureSelector.bind(this);
    this.handleDeptChange = this.handleDeptChange.bind(this);
    this.handleDeptNumberChange = this.handleDeptNumberChange.bind(this);
  }

  handleCCNChange(event) {
    this.props.changedCCN({ ccn: event.target.value });
  }

  handleDeptChange({ value }) {
    this.props.changedDept({ dept: value || '' });
  }

  handleDeptNumberChange({ value }) {
    this.props.changedDeptNumber({ deptNumber: value || '' });
  }

  handleSelector({ value }, which) {
    this.props.setSelection({ which, selection: value || '' });
  }

  handleLectureSelector({ value }) {
    this.props.changedLectureSelection({
      selection: value || '',
      lectureSections: this.props.lectureSections,
    });
  }

  handleClickedAdd() {
    $('.add-course-confirm').modal('show');
  }

  render() {
    let lectureSections = this.props.lectureSections.map((lectureSection, i) => (
      { value: i.toString(), label: lectureSection.toString() }
    ));
    let lectureSelection = (this.props.lectureSections.length === 0 ?
                            '' : this.props.lectureSection);
    let depts = this.props.deptOptions.map((dept) => (
      { value: dept, label: dept }
    ));
    let deptNumbers = alphanumSort(this.props.deptNumbers, false).map((dn) => (
      { value: dn, label: dn }
    ));
    let lectureAvailability = this.props.lectureAvailability;
    if (this.props.isLoadingLectureAvailability) {
      lectureAvailability = 'Loading...';
    }
    let globalDisable = this.props.isLoadingSections
                        || this.props.isLoadingLectureAvailability
                        || this.props.isAddingCourse;
    const enabled = {
      lectureSection: !globalDisable && this.props.lectureSections.length > 1,
      deptNumber: !globalDisable && this.props.deptNumbers.length > 0,
      //section: !globalDisable && this.props.sectionGroups.length > 0,
    };
    const sectionsForSectionGroup = (sectionGroup) => (sectionGroup.map((section, i) => ({
      value: i.toString(),
      label: `${section.id} | ${section.time} | ${section.room} | ${section.instructor} | ${section.availability}`,
    })));
    let resetValue = { value: '' };
    let sectionSelectors = this.props.sectionGroups.map((sectionGroup, i) => (
      <div className="add-class-form-row" key={i}>
        <Select
          className="add-class-discussion"
          disabled={globalDisable || sectionGroup.length <= 1}
          placeholder={this.props.isLoadingSections ? 'Loading sections...' : 'Choose a section'}
          value={this.props.selections[i]}
          resetValue={resetValue}
          options={sectionsForSectionGroup(sectionGroup)}
          matchPos="start"
          onChange={(val) => this.handleSelector(val, i)}
          searchable
        />
      </div>
    ));
    return (
      <div className="add-class-panel">
        <div className="add-class-header">Add Class</div>
        {this.props.error && <div className="add-class-error-msg">{this.props.error}</div>}
        <div className="add-class-form">
          <div className="add-class-form-row">
            <input
              className="add-class-CCN outline-blue"
              disabled={globalDisable}
              placeholder="CCN"
              type="text"
              value={this.props.ccn}
              onChange={this.handleCCNChange}
            />
            <Select
              className="add-class-department outline-blue"
              disabled={globalDisable}
              placeholder="Department"
              value={this.props.dept}
              resetValue={resetValue}
              matchPos="start"
              onChange={this.handleDeptChange}
              options={depts}
            />
            <Select
              className="add-class-course-number"
              disabled={!enabled.deptNumber}
              placeholder="Course No."
              value={this.props.deptNumber}
              resetValue={resetValue}
              matchPos="start"
              onChange={this.handleDeptNumberChange}
              options={deptNumbers}
            />
          </div>
          <div className="add-class-form-row">
            <Select
              className="add-class-lecture-section"
              disabled={!enabled.lectureSection}
              placeholder="Section"
              value={lectureSelection}
              resetValue={resetValue}
              options={lectureSections}
              searchable={false}
              onChange={this.handleLectureSelector}
            />
          </div>
          <div className="add-class-form-row">
            <select className="add-class-class-name" value="" disabled>
              <option value="" disabled>{this.props.courseName || 'Class Name'}</option>
            </select>
            <div className="add-class-waitlist-status">
              Status: <span className="color-blue">{lectureAvailability}</span>
            </div>
          </div>
          <div className="add-class-form-row">
            <Select
              className="add-class-lab-section"
              disabled={!enabled.lectureSection}
              placeholder="Choose a discussion section"
              value={lectureSelection}
              resetValue={resetValue}
              options={lectureSections}
              searchable={false}
              onChange={this.handleLectureSelector}
            />
          </div>
          <div className="add-class-form-row">
            <Select
              className="add-class-discussion-section"
              disabled={!enabled.lectureSection}
              placeholder="Choose a lab section"
              value={lectureSelection}
              resetValue={resetValue}
              options={lectureSections}
              searchable={false}
              onChange={this.handleLectureSelector}
            />
          </div>
          <div className="add-class-form-row">
            <Select
              className="add-class-grade-option"
              disabled={!enabled.lectureSection}
              placeholder="Grade option"
              value={lectureSelection}
              resetValue={resetValue}
              options={lectureSections}
              searchable={false}
              onChange={this.handleLectureSelector}
            />
            <input
              className="add-class-CEC"
              disabled={globalDisable}
              placeholder="Class Entry Code (optional)"
              type="text"
            />
          </div>


          {sectionSelectors}
          <div className="add-class-form-row add-class-waitlist-row">
            <label className="add-class-waitlist">
              Waitlist class if full
              <input
                className="add-class-waitlist-button"
                type="checkbox"
                name="waitlist"
                id="waitlist"
              />
            </label>
            <button
              className="add-class-submit-button"
              onClick={this.handleClickedAdd}
              disabled={globalDisable}
              id="add-class"
            >
              Add
            </button>
          </div>
        </div>
      </div>
      );
  }
}

CoursePicker.propTypes = {
  ccn: React.PropTypes.string.isRequired,
  sectionGroups: React.PropTypes.array.isRequired,
  isAddingCourse: React.PropTypes.bool.isRequired,
  isLoadingSections: React.PropTypes.bool.isRequired,
  isLoadingLectureAvailability: React.PropTypes.bool.isRequired,
  dept: React.PropTypes.string.isRequired,
  deptNumber: React.PropTypes.string.isRequired,
  deptOptions: React.PropTypes.array.isRequired,
  deptNumbers: React.PropTypes.array.isRequired,
  courseName: React.PropTypes.string.isRequired,
  error: React.PropTypes.string.isRequired,
  lectureSection: React.PropTypes.string.isRequired,
  lectureAvailability: React.PropTypes.string.isRequired,
  lectureSections: React.PropTypes.array.isRequired,
  selections: React.PropTypes.array.isRequired,
  changedCCN: React.PropTypes.func.isRequired,
  changedDept: React.PropTypes.func.isRequired,
  changedDeptNumber: React.PropTypes.func.isRequired,
  changedLectureSelection: React.PropTypes.func.isRequired,
  setSelection: React.PropTypes.func.isRequired,
};


export default CoursePicker;
