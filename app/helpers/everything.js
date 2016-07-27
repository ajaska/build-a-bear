import ccn_indexed from '../data/ccn_indexed.json';
import depts from '../data/depts.json';
import dept_indexed from '../data/dept_indexed.json';


export function isValidCCN(ccn) {
  return ccn_indexed.hasOwnProperty(ccn);
}

export function isValidDept(dept) {
  return depts.hasOwnProperty(dept);
}

export function isValidDeptNumber(dept, deptNumber) {
  return deptNumbersForDept(dept).includes(deptNumber);
}

export function deptNumbersForDept(dept) {
  if (!isValidDept(dept)) {
    return [];
  }
  let realDept = depts[dept];
  return Object.keys(dept_indexed[realDept])
}

export function allDepts() {
  return Object.keys(depts)
}

export function lectureSectionsFromDept(dept, deptNumber) {
  if (!isValidDept(dept) || !isValidDeptNumber(dept, deptNumber)) {
    return [];
  }
  let realDept = depts[dept];
  let ccns = dept_indexed[realDept][deptNumber];
  return ccns.map(ccn => lectureSectionFromCCN(ccn)).sort((a,b) => a > b ? 1 : -1)
}

export function lectureSectionFromCCN(ccn) {
  let data = ccn_indexed[ccn];
  return new LectureSection(
    ccn.toString(),
    data[0], // dept
    data[1], // deptNumber
    data[2], // section
    data[4], // courseName
    data[5], // units
    data[6], // room
    formatTime(data[7], data[8], data[9]),
    data[10] // instructor
  )
}

function formatTime(days, start, end) {
  if (!days || !start || !end) {
    return "";
  }
  return `${days} ${start}-${end}`;
}

export class LectureSection{
  constructor(ccn, dept, deptNumber, section, courseName, units, room, time, instructor) {
    this.ccn = ccn.toString();  // 26397
    this.dept = dept; // BIOENG
    this.deptNumber = deptNumber; // 100
    this.courseName = courseName;
    this.units = units;
    this.section = section; // 001
    this.room = room; // Stanley 106
    this.time = time; // TuTh 12:30PM - 1:59PM
    this.instructor = instructor; // H. Lam
  }

  toString() {
    // return `${this.dept} ${this.deptNumber}-${this.section} LEC ${this.courseName} - ${this.room} | ${this.time} - ${this.instructor}`
    return `LEC ${this.section} - ${this.room} - ${this.time} - ${this.instructor}`
  }
}
