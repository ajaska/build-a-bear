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
    this.handleGradingOptionChange = this.handleGradingOptionChange.bind(this);
    this.handleCECChange = this.handleCECChange.bind(this);
  }

  handleCCNChange(event) {
    this.props.changedCCN({ ccn: event.target.value });
  }

  handleCECChange(event) {
    this.props.setCEC({ cec: event.target.value });
  }

  handleDeptChange({ value }) {
    this.props.changedDept({ dept: value || '' });
  }

  handleDeptNumberChange({ value }) {
    this.props.changedDeptNumber({ deptNumber: value || '' });
  }

  handleGradingOptionChange({ value }) {
    this.props.setGradingOption({ option: value || '' });
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
                        || this.props.isAddingCourse
                        || this.props.isDroppingCartCourse;
    const enabled = {
      lectureSection: !globalDisable && this.props.lectureSections.length > 1,
      deptNumber: !globalDisable && this.props.deptNumbers.length > 0,
      section: !globalDisable && !this.props.isClosed,
      gradeOption: !globalDisable && this.props.lectureSections.length > 0 && !this.props.isClosed,
      addButton: !globalDisable && !this.props.error && !this.props.isClosed,
    };
    const highlighted = {
      ccn: !this.props.dept,
      dept: !this.props.dept,
      deptNumber: this.props.dept && !this.props.deptNumber,
      lectureSection: this.props.lectureSections.length > 1 && !this.props.lectureSection,
      section: this.props.sectionGroups.length > 0,
      gradeOption: this.props.lectureSections.length > 0 && !this.props.gradingOption,
    };
    const sectionsForSectionGroup = (sectionGroup) => (sectionGroup.map((section, i) => ({
      value: i.toString(),
      label: `${section.ccn} | ${section.time.toString()} | ${section.room} | ${section.instructor} | ${section.availability}`,
    })));
    let resetValue = { value: '' };
    let sectionSelectors = this.props.sectionGroups.map((sectionGroup, i) => (
      <div className="add-class-form-row" key={i}>
        <Select
          className={`add-class-discussion${highlighted.section && !this.props.selections[i] ? " outline-blue" : ""}`}
          disabled={!enabled.section || sectionGroup.length <= 1}
          placeholder={this.props.isLoadingSections ? 'Loading sections...' : 'Choose a section'}
          value={this.props.selections[i]}
          resetValue={resetValue}
          options={sectionsForSectionGroup(sectionGroup)}
          onChange={(val) => this.handleSelector(val, i)}
          searchable
          clearable={false}
        />
      </div>
    ));
    const gradeOption = [
      { value: "pnp", label: "P/NP" },
      { value: "graded", label: "Letter Grade" },
    ];
    let warning = null;
    if (this.props.warning) {
      warning = (
        <div className="add-class-form-row add-class-warning-msg clearfix">
          <div className="add-class-warning-msg-icon-wrapper">
            <i className="add-class-warning-msg-icon warning circle icon"></i>
          </div>
          <span className="add-class-warning-msg-text">{this.props.warning}</span>
        </div>
      );
    }
    return (
      <div className="add-class-panel">
        <div className="add-class-header">Add Class</div>
        {this.props.error && <div className="add-class-error-msg">{this.props.error}</div>}
        <div className="add-class-form">
          <div className="add-class-form-row">
            <input
              className={`add-class-CCN${highlighted.ccn ? " outline-blue" : ""}`}
              disabled={globalDisable}
              placeholder="CCN"
              type="text"
              value={this.props.ccn}
              onChange={this.handleCCNChange}
            />
            <Select
              className={`add-class-department${highlighted.dept ? " outline-blue" : ""}`}
              disabled={globalDisable}
              placeholder="Department"
              value={this.props.dept}
              resetValue={resetValue}
              matchPos="start"
              onChange={this.handleDeptChange}
              options={depts}
            />
            <Select
              className={`add-class-course-number${highlighted.deptNumber ? " outline-blue" : ""}`}
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
              className={`add-class-lecture-section${highlighted.lectureSection ? " outline-blue" : ""}`}
              disabled={!enabled.lectureSection}
              placeholder="Section"
              value={this.props.lectureSection}
              resetValue={resetValue}
              options={lectureSections}
              searchable={false}
              clearable={false}
              onChange={this.handleLectureSelector}
            />
          </div>
          <div className="add-class-form-row">
            <select className="add-class-class-name" value="" disabled>
              <option value="" disabled>{this.props.desc || 'Class Name'}</option>
            </select>
            <div className="add-class-waitlist-status">
              Status: <span className="color-blue">{lectureAvailability}</span>
            </div>
          </div>
          {sectionSelectors}
          <div className="add-class-form-row">
            <Select
              className={`add-class-grade-option${highlighted.gradeOption ? " outline-blue" : ""}`}
              disabled={!enabled.gradeOption}
              placeholder="Grade option"
              value={this.props.gradingOption}
              resetValue={resetValue}
              options={gradeOption}
              searchable={false}
              clearable={false}
              onChange={this.handleGradingOptionChange}
            />
            <input
              className="add-class-CEC"
              disabled={!enabled.gradeOption}
              placeholder="Class Entry Code (optional)"
              type="text"
              value={this.props.cec}
              onChange={this.handleCECChange}
            />
          </div>
          {warning}


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
              disabled={!enabled.addButton}
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
  isDroppingCartCourse: React.PropTypes.bool.isRequired,
  dept: React.PropTypes.string.isRequired,
  deptNumber: React.PropTypes.string.isRequired,
  deptOptions: React.PropTypes.array.isRequired,
  deptNumbers: React.PropTypes.array.isRequired,
  desc: React.PropTypes.string.isRequired,
  error: React.PropTypes.string.isRequired,
  isClosed: React.PropTypes.bool.isRequired,
  warning: React.PropTypes.string,
  lectureSection: React.PropTypes.string.isRequired,
  lectureAvailability: React.PropTypes.string.isRequired,
  lectureSections: React.PropTypes.array.isRequired,
  selections: React.PropTypes.array.isRequired,
  changedCCN: React.PropTypes.func.isRequired,
  changedDept: React.PropTypes.func.isRequired,
  changedDeptNumber: React.PropTypes.func.isRequired,
  changedLectureSelection: React.PropTypes.func.isRequired,
  setSelection: React.PropTypes.func.isRequired,
  gradingOption: React.PropTypes.string.isRequired,
  setGradingOption: React.PropTypes.func.isRequired,
  cec: React.PropTypes.string.isRequired,
  setCEC: React.PropTypes.func.isRequired,
};


export default CoursePicker;
