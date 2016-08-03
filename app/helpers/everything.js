import ccnIndexed from '../data/ccn_indexed.json';
import depts from '../data/depts.json';
import deptIndexed from '../data/dept_indexed.json';


export function isValidCCN(ccn) {
  return ccnIndexed.hasOwnProperty(ccn);
}

export function isValidDept(dept) {
  return depts.hasOwnProperty(dept);
}

export function deptNumbersForDept(dept) {
  if (!isValidDept(dept)) {
    return [];
  }
  const realDept = depts[dept];
  return Object.keys(deptIndexed[realDept]);
}

export function isValidDeptNumber(dept, deptNumber) {
  return deptNumbersForDept(dept).includes(deptNumber);
}

export function allDepts() {
  return Object.keys(depts);
}

export class LectureSection {
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
    return `LEC ${this.section} - ${this.room} - ${this.time} - ${this.instructor}`;
  }
}

function formatTime(days, start, end) {
  if (!days || !start || !end) {
    return '';
  }
  return `${days} ${start}-${end}`;
}

export function shortenRoom(room) {
  let newRoom = room;
  newRoom = newRoom.replace('Valley Life Sciences', 'VLSB');
  newRoom = newRoom.replace('Genetics Plant Bio', 'GPB');
  newRoom = newRoom.replace('Goldman School of Public Policy', 'GSPP');
  newRoom = newRoom.replace('Hearst Memorial Gymnasium', 'Hearst Gym');
  newRoom = newRoom.replace('Hearst Memorial Mining Building', 'Hearst Mining');
  newRoom = newRoom.replace('Hewlett-Packard Auditorium', 'HP Auditorium');
  return newRoom;
}

export function lectureSectionFromCCN(ccn) {
  const data = ccnIndexed[ccn];
  return new LectureSection(
    ccn.toString(),
    data[0], // dept
    data[1], // deptNumber
    data[2], // section
    data[4], // courseName
    data[5], // units
    shortenRoom(data[6]), // room
    formatTime(data[7], data[8], data[9]),
    data[10] // instructor
  );
}

export function lectureSectionsFromDept(dept, deptNumber) {
  if (!isValidDept(dept) || !isValidDeptNumber(dept, deptNumber)) {
    return [];
  }
  const realDept = depts[dept];
  const ccns = deptIndexed[realDept][deptNumber];
  return ccns.map(ccn => lectureSectionFromCCN(ccn)).sort((a, b) => (a > b ? 1 : -1));
}
