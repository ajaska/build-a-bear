import React from 'react';
import Select from 'react-select';

class CoursePicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleCCNChange = this.handleCCNChange.bind(this);
    this.handleSelector = this.handleSelector.bind(this);
    this.handleLectureSelector = this.handleLectureSelector.bind(this);
  }

  handleCCNChange(event) {
    this.props.changedCCN({ ccn: event.target.value });
  }

  handleDeptChange({value}) {
    this.props.changedDept({ dept: value });
  }

  handleDeptNumberChange({value}) {
    this.props.changedDeptNumber({ deptNumber: value });
  }

  handleSelector({value}, which) {
    this.props.setSelection({ which, selection: value });
  }

  handleLectureSelector({value}) {
    this.props.changedLectureSelection({
      selection: value,
      lectureSections: this.props.lectureSections,
    });
  }

  handleClickedAdd() {
    $('.add-course-confirm').modal('show');
  }

  render() {
    let lectureSections = this.props.lectureSections.map((lectureSection, i) => (
      {value: i.toString(), label: lectureSection.toString()}
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
      label: `${section.id} | ${section.time} | ${section.room} | ${section.instructor} | ${section.availability}`
    })));
    let sectionSelectors = this.props.sectionGroups.map((sectionGroup, i) => (
      <div className="add-class-form-row" key={i}>
        <Select
          className="add-class-discussion"
          disabled={globalDisable || sectionGroup.length <= 1}
          placeholder={this.props.isLoadingSections ? 'Loading sections...' : 'Choose a section'}
          value={this.props.selections[i]}
          resetValue={resetValue}
          options={sectionsForSectionGroup(sectionGroup)}
          onChange={(val) => this.handleSelector(val, i)}
          searchable={true}
        />
      </div>
    ));
    let resetValue = {value: ""};
    return (
      <div className="add-class-panel">
        <div className="add-class-header">Add Class</div>
        {this.props.error && <div className="add-class-error-msg">{this.props.error}</div>}
        <div className="add-class-form">
          <div className="add-class-form-row">
            <input
              className="add-class-CCN outline-blue"
              disabled={ globalDisable }
              placeholder="CCN"
              type="text"
              value={this.props.ccn}
              resetValue={resetValue}
              onChange={this.handleCCNChange}
            />
            <Select
              className="add-class-section"
              disabled={!enabled.lectureSection}
              placeholder="Section"
              value={lectureSelection}
              resetValue={resetValue}
              options={lectureSections}
              onChange={this.handleLectureSelector}
            />
          </div>
          <div className="add-class-form-row">
            <Select
              className="add-class-department outline-blue"
              disabled={globalDisable}
              placeholder="Department"
              value={this.props.dept}
              resetValue={resetValue}
              onChange={this.handleDeptChange.bind(this)}
              options={depts}
            />
            <Select
              className="add-class-course-number"
              disabled={!enabled.deptNumber}
              placeholder="Course Number"
              value={this.props.deptNumber}
              resetValue={resetValue}
              onChange={this.handleDeptNumberChange.bind(this)}
              options={deptNumbers}
            />
          </div>
          <div className="add-class-form-row">
            <select className="add-class-class-name" value="" disabled>
              <option value="" disabled>{this.props.courseName || "Course Name"}</option>
            </select>
            <div className="add-class-waitlist-status">Status: <span className="color-blue">{lectureAvailability}</span></div>
          </div>

          { sectionSelectors }
          <div className="add-class-form-row add-class-waitlist-row">
            <label className="add-class-waitlist">Waitlist class if full<input className="add-class-waitlist-button" type="checkbox" name="waitlist" id="waitlist"/></label>
            <button className="add-class-submit-button" onClick={this.handleClickedAdd.bind(this)} disabled={globalDisable} id="add-class">Add</button>
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
}

// http://web.archive.org/web/20130826203933/http://my.opera.com/GreyWyvern/blog/show.dml/1671288
function alphanumSort (arr, caseInsensitive) {
  for (var z = 0, t; t = arr[z]; z++) {
    arr[z] = [];
    var x = 0, y = -1, n = 0, i, j;

    while (i = (j = t.charAt(x++)).charCodeAt(0)) {
      var m = (i == 46 || (i >=48 && i <= 57));
      if (m !== n) {
        arr[z][++y] = "";
        n = m;
      }
      arr[z][y] += j;
    }
  }

  arr.sort(function(a, b) {
    for (var x = 0, aa, bb; (aa = a[x]) && (bb = b[x]); x++) {
      if (caseInsensitive) {
        aa = aa.toLowerCase();
        bb = bb.toLowerCase();
      }
      if (aa !== bb) {
        var c = Number(aa), d = Number(bb);
        if (c == aa && d == bb) {
          return c - d;
        } else return (aa > bb) ? 1 : -1;
      }
    }
    return a.length - b.length;
  });

  for (var z = 0; z < arr.length; z++)
    arr[z] = arr[z].join("");
  return arr;
}


export default CoursePicker;
