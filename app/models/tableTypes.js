import * as ColumnType from './columnTypes';

class Table {
  constructor(...columns) {
    this.columns = columns;
  }

  parse(rows) {
    return rows.map(row => (
      Object.assign({},
        ...[...row.children].map((td, i) => (
          this.columns[i].parse(td)
        ))
      )
    ));
  }
}

export const ShoppingCartTable = new Table(
  new ColumnType.Selectable,
  new ColumnType.Class,
  new ColumnType.DaysTimes,
  new ColumnType.Room,
  new ColumnType.Instructor,
  new ColumnType.Units,
  new ColumnType.AvailabilityStatus
);

export const EnrolledCoursesTable = new Table(
  new ColumnType.Class,
  new ColumnType.Description,
  new ColumnType.DaysTimes,
  new ColumnType.Room,
  new ColumnType.Instructor,
  new ColumnType.Units,
  new ColumnType.EnrollmentStatus
);

export const DiscussionTable = new Table(
  new ColumnType.Noop,
  new ColumnType.ClassNbr,
  new ColumnType.Section,
  new ColumnType.Schedule,
  new ColumnType.Room,
  new ColumnType.Instructor,
  new ColumnType.AvailabilityStatus
);

export const SemesterTable = new Table(
  new ColumnType.Noop,
  new ColumnType.Term,
  new ColumnType.Career,
  new ColumnType.Noop
);
