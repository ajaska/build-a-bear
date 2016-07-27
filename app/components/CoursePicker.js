import React from 'react';
import $ from 'jquery';

class CoursePicker extends React.Component {
  handleCCNChange(event) {
    this.props.changedCCN({ ccn: event.target.value });
  }

  handleDeptChange(event) {
    this.props.changedDept({ dept: event.target.value });
  }

  handleDeptNumberChange(event) {
    this.props.changedDeptNumber({ deptNumber: event.target.value });
  }

  handleSelector(which, event) {
    this.props.setSelection({ which, selection: event.target.value });
  }

  handleLectureSelector(event) {
    this.props.changedLectureSelection({
      selection: event.target.value,
      lectureSections: this.props.lectureSections,
    });
  }

  handleClickedAdd() {
    $('.add-course-confirm').modal('show');
  }

  render() {
    let lectureSections = this.props.lectureSections.map((lectureSection, i) =>
      <option value={i} key={i}>
        {lectureSection.toString()}
      </option>
    );
    let lectureSelection = (this.props.lectureSections.length === 0 ?
                            '' : this.props.lectureSection);
    let depts = this.props.deptOptions.map((dept, i) =>
      <option value={dept} key={i}>{dept}</option>
    );
    let deptNumbers = alphanumSort(this.props.deptNumbers, false).map((dn, i) =>
      <option value={dn} key={i}>{dn}</option>
    );
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
    const sectionsForSectionGroup = (sectionGroup) => (sectionGroup.map((section, i) =>
      <option value={i} key={i}>
        {section.id} | {section.time} | {section.room} | {section.instructor} | {section.availability}
      </option>
    ));
    let sectionSelectors = this.props.sectionGroups.map((sectionGroup, i) => (
      <div className="add-class-form-row" key={i}>
        <select
          className="add-class-discussion"
          disabled={globalDisable || sectionGroup.length <= 1}
          value={this.props.selections[i]}
          onChange={this.handleSelector.bind(this, i)}
        >
          <option value="" disabled>
            {this.props.isLoadingSections ? 'Loading sections...' : 'Choose a section'}
          </option>
          {sectionsForSectionGroup(sectionGroup)}
        </select>
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
              disabled={ globalDisable }
              placeholder="CCN"
              type="text"
              value={this.props.ccn}
              onChange={this.handleCCNChange.bind(this)}
            />
            <select
              className="add-class-section"
              disabled={ !enabled.lectureSection }
              value={ lectureSelection }
              onChange={this.handleLectureSelector.bind(this)}
            >
              <option value="" disabled>Section</option>
              { lectureSections }
            </select>
          </div>
          <div className="add-class-form-row">
            <select className="add-class-department outline-blue" disabled={globalDisable} value={this.props.dept} onChange={this.handleDeptChange.bind(this)} >
              <option value="" disabled>Department</option>
              { depts }
            </select>
            <select className="add-class-course-number" disabled={!enabled.deptNumber} value={this.props.deptNumber} onChange={this.handleDeptNumberChange.bind(this)} >
              <option value="" disabled>Course Number</option>
              { deptNumbers }
            </select>
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
