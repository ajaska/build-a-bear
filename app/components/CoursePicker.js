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

  handleLectureSelector(event) {
    this.props.changedLectureSelection({selection: event.target.value, sections: this.props.lectureSections})
  }

  clickedAdd(event) {
    event.preventDefault();
    this.props.clickedAdd({
      ccn: this.props.ccn,
      selection: this.props.selection,
    });
  }

  render() {
    let lectureSections = this.props.lectureSections.map((lectureSection, i) => {
      return (
        <option value={i} key={i}>
          {lectureSection.toString()}
        </option>
       )
    })
    let lectureSelection = (this.props.lectureSections.length === 0 ? "" : this.props.lectureSection);
    let sections;
    if(this.props.sections.length > 0) {
      sections = this.props.sections.map((section, i) => {
        return (
          <option value={i} key={i}>
            {section.id} | {section.time} | {section.room} | {section.instructor} | {section.availability}
          </option>
        )
      });
    } else if (this.props.isLoadingSections) {
      sections = [];
    } else if (this.props.ccn
               && this.props.deptNumber
               && this.props.dept) {
      sections = [];
    } else {
      sections = [];
    }
    let depts = this.props.deptOptions.map((dept, i) => <option value={dept} key={i}>{ dept }</option>);
    let deptNumbers = alphanumSort(this.props.deptNumbers, false).map((dn, i) => <option value={dn} key={i}>{ dn }</option>);
    return (
      <div className="add-class-panel">
        <div className="add-class-header">Add Class</div><div className="add-class-error-msg">This conflicts with your schedule.</div>
        <div className="add-class-form">
          <div className="add-class-form-row">
            <input
              className="add-class-CCN outline-blue"
              placeholder="CCN"
              type="text"
              value={this.props.ccn}
              onChange={this.handleCCNChange.bind(this)}
            />
            <select
              className="add-class-section"
              value={ lectureSelection }
              onChange={this.handleLectureSelector.bind(this)} >
              <option value="" disabled>Section</option>
              { lectureSections }
            </select>
          </div>
          <div className="add-class-form-row">
            <select className="add-class-department outline-blue" value={this.props.dept} onChange={this.handleDeptChange.bind(this)} >
                <option value="" disabled>Department</option>
                { depts }
            </select>
            <select className="add-class-course-number" value={this.props.deptNumber} onChange={this.handleDeptNumberChange.bind(this)} >
                <option value="" disabled>Course Number</option>
                { deptNumbers }
            </select>
          </div>
          <div className="add-class-form-row">
            <select className="add-class-class-name" value="">
                <option value="" disabled>{this.props.courseName || "Course Name"}</option>
            </select>
            <div className="add-class-waitlist-status">Status: <span className="color-blue">Waitlist Open</span></div>
          </div>
          <div className="add-class-form-row">
            <select
              className="add-class-discussion"
              value={this.props.selection}
              onChange={this.handleSelector.bind(this)} >
              <option value="" disabled>Choose a discussion section</option>
              { sections }
            </select>
          </div>
          <div className="add-class-form-row">
            <select className="add-class-lab" value="">
                <option value="" disabled>Choose a lab section</option>
                <option value="memes">Memes</option>
            </select>
          </div>
          <div className="add-class-form-row add-class-waitlist-row">
            <label className="add-class-waitlist">Waitlist class if full<input className="add-class-waitlist-button" type="checkbox" name="waitlist" id="waitlist"/></label>
            <button className="add-class-submit-button">Add</button>
          </div>
        </div>
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
