import ccnIndexed from '../data/ccn_indexed.json';
import depts from '../data/depts.json';
import deptIndexed from '../data/dept_indexed.json';

import { Lecture } from '../models/models';

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
  return new Lecture({
    ccn: ccn.toString(),
    dept: data[0],
    deptNumber: data[1],
    section: data[2],
    type: data[3],
    desc: data[4],
    units: data[5],
    room: data[6],
    time: formatTime(data[7], data[8], data[9]),
    instructor: data[10],
  });
}

export function lectureSectionsFromDept(dept, deptNumber) {
  if (!isValidDept(dept) || !isValidDeptNumber(dept, deptNumber)) {
    return [];
  }
  const realDept = depts[dept];
  const ccns = deptIndexed[realDept][deptNumber];
  return ccns.map(ccn => lectureSectionFromCCN(ccn)).sort((a, b) => (a > b ? 1 : -1));
}
