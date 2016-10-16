import { Course, Lecture, Section } from '../models/models';
import {
  ShoppingCartTable,
  EnrolledCoursesTable,
  DiscussionTable,
  SemesterTable,
} from '../models/tableTypes';

function groupRawRows(rawRows) {
  const courses = [];
  for (let i = 0; i < rawRows.length; ++i) {
    if (rawRows[i].enrollmentStatus === 'Dropped') {
      continue;
    }

    if (rawRows[i].selectable) {
      const lecture = new Lecture(rawRows[i]);
      courses.push(new Course({ lecture, sections: [] }));
    } else {
      const section = new Section(rawRows[i]);
      const course = courses[courses.length - 1];
      course.sections.push(section);
    }
  }
  return courses;
}

export function parseEnrolledCoursesTable(rows) {
  const rawRows = EnrolledCoursesTable.parse([...rows]);
  return groupRawRows(rawRows);
}

export function parseShoppingCartTable(rows) {
  const rawRows = ShoppingCartTable.parse([...rows]);
  return groupRawRows(rawRows);
}

export function parseDiscussionTable(rows) {
  return DiscussionTable.parse([...rows]);
}

export function parseSemesterSelectionTable(rows) {
  return SemesterTable.parse([...rows]);
}
