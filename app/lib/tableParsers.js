const schemaTypes = {
  selectable: Symbol('Selectable'), // [x]
  course_id: Symbol('Class'), // COMPSCI 162-00 \n (27170)
  ccn: Symbol('Class Nbr'), // 27170
  section: Symbol('Section'), // 101
  desc: Symbol('Description'), // Op Sys And Sys Prog (Lecture)
  time: Symbol('Days/Times'), // MoWe 5:00PM - 6:29PM
  room: Symbol('Room'), // Valley Life Sciences 2050
  instructor: Symbol('Instructor'), // A. Joseph
  units: Symbol('Units'), // 4.00
  enrollment_status: Symbol('Status'), // Enrolled, Dropped, Wait Listed
  availability: Symbol('Availability'), // Open, Closed, Wait List
};

class Column {
  constructor(position, type) {
    this.position = position;
    this.type = type;
  }
}

function parseColumn(column, columnType) {
  switch (columnType) {
    case schemaTypes.selectable:
      return { selectable: column.innerHTML.includes('checkbox') };
    case schemaTypes.course_id: {
      const text = column.innerText.trim();
      // TODO: deprecate old course
      const course = text.split(/\n+/)[0];
      const section = course.split('-')[1];
      let id = text.split(/\n+/)[1];
      id = id.replace('(', '').replace(')', '').trim();
      return { course, id, section };
    }
    case schemaTypes.ccn:
      return { id: column.innerText.trim() };
    case schemaTypes.section:
      return { section: column.innerText.trim() };
    case schemaTypes.desc: {
      const desc = column.innerText.trim();
      let type = 'unknown';
      if (desc.includes('Lecture')) {
        type = 'Lecture';
      } else if (desc.includes('Discussion')) {
        type = 'Discussion';
      } else if (desc.includes('Lab')) {
        type = 'Lab';
      } else if (desc.includes('Recitation')) {
        type = 'Recitation';
      }
      return { desc, type };
    }
    case schemaTypes.time:
      return { time: column.innerText.trim() };
    case schemaTypes.room:
      return { room: column.innerText.trim() };
    case schemaTypes.instructor:
      return { instructor: column.innerText.trim() };
    case schemaTypes.units:
      return { units: column.innerText.trim() };
    case schemaTypes.enrollment_status:
      if (column.innerHTML.includes('Wait Listed')) {
        return { enrollment_status: 'Wait Listed' };
      } else if (column.innerHTML.includes('Enrolled')) {
        return { enrollment_status: 'Enrolled' };
      } else if (column.innerHTML.includes('Dropped')) {
        return { enrollment_status: 'Dropped' };
      }
      return { enrollment_status: 'Unknown' };
    case schemaTypes.availability:
      if (column.innerHTML.includes('Wait List')) {
        return { availability: 'Wait List' };
      } else if (column.innerHTML.includes('Closed')) {
        return { availability: 'Closed' };
      } else if (column.innerHTML.includes('Open')) {
        return { availability: 'Open' };
      }
      return { availability: 'Unknown' };

    default:
      break;
  }
  console.error(columnType);
  console.error(JSON.stringify(column));
  throw new Error("Don't know how to parse column type");
}

function tableParser(tableSchema) {
  return (tableRows) => {
    const data = [];
    for (let i = 0; i < tableRows.length; ++i) {
      const row = tableRows[i];
      const columns = row.children;
      const parsedTable = tableSchema.reduce((rowInfo, columnSchema) => {
        const parsedInfo = parseColumn(
          columns[columnSchema.position],
          columnSchema.type
        );
        return Object.assign(rowInfo, parsedInfo);
      }, {});
      data.push(parsedTable);
    }
    return data;
  };
}

export const parseEnrolledCoursesTable = tableParser([
  new Column(0, schemaTypes.course_id),
  new Column(1, schemaTypes.desc),
  new Column(2, schemaTypes.time),
  new Column(3, schemaTypes.room),
  new Column(4, schemaTypes.instructor),
  new Column(5, schemaTypes.units),
  new Column(6, schemaTypes.enrollment_status),
]);

export const parseShoppingCartTable = tableParser([
  new Column(0, schemaTypes.selectable),
  new Column(1, schemaTypes.course_id),
  new Column(2, schemaTypes.time),
  new Column(3, schemaTypes.room),
  new Column(4, schemaTypes.instructor),
  new Column(5, schemaTypes.units),
  new Column(6, schemaTypes.availability),
]);

export const parseDiscussionTable = tableParser([
  new Column(1, schemaTypes.ccn),
  new Column(2, schemaTypes.section),
  new Column(3, schemaTypes.time),
  new Column(4, schemaTypes.room),
  new Column(5, schemaTypes.instructor),
  new Column(6, schemaTypes.availability),
]);
