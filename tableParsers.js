const schemaTypes = {
  course_id: Symbol("Class"), // COMPSCI 162-00 \n (27170)
  ccn: Symbol("Class Nbr"), // 27170
  section: Symbol("Section"), // 101
  desc: Symbol("Description"), // Op Sys And Sys Prog (Lecture)
  time: Symbol("Days/Times"), // MoWe 5:00PM - 6:29PM
  room: Symbol("Room"), // Valley Life Sciences 2050
  instructor: Symbol("Instructor"), // A. Joseph
  units: Symbol("Units"), // 4.00
  enrollment_status: Symbol("Status"), // Enrolled, Dropped, Waitlisted
}

class Column {
  constructor(position, type) {
    this.position = position;
    this.type = type;
  }
}

function tableParser(tableSchema) {
  return function(tableRows) {
    let data = [];
    for (let i=0; i<tableRows.length; ++i) {
      let row = tableRows[i];
      let columns = row.children;
      let rowInfo = tableSchema.reduce(function(rowInfo, columnSchema) {
        let parsedInfo = parseColumn(
          columns[columnSchema.position],
          columnSchema.type
        );
        return Object.assign(rowInfo, parsedInfo);
      }, {});
      data.push(rowInfo)
    }
    return data;
  }
}

function parseColumn(column, columnType) {
  switch (columnType) {
    case schemaTypes.course_id:
      let course = column.innerText.split('\n')[0];
      let id = column.innerText.split('\n')[1];
      id = id.replace("(", "").replace(")", "");
      return { course: course, id: id }
    case schemaTypes.ccn:
      return { id: column.innerText.trim() }
    case schemaTypes.section:
      return { section: column.innerText.trim() }
    case schemaTypes.desc:
      return { desc: column.innerText.trim() }
    case schemaTypes.time:
      return { time: column.innerText.trim() }
    case schemaTypes.room:
      return { room: column.innerText.trim() }
    case schemaTypes.instructor:
      return { instructor: column.innerText.trim() }
    case schemaTypes.units:
      return { units: column.innerText.trim() }
    case schemaTypes.enrollment_status:
      if (column.innerHTML.indexOf("Wait Listed" !== -1)) {
        return { enrollment_status: "Wait listed" }
      } else if (column.innerHTML.indexOf("Enrolled" !== -1)) {
        return { enrollment_status: "Enrolled" }
      } else if (column.innerHTML.indexOf("Dropped" !== -1)) {
        return { enrollment_status: "Dropped" }
      }
      break;
    default:
      break;
  }
  console.log(columnType);
  console.log(JSON.stringify(column));
  throw "Don't know how to parse column type";
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
  new Column(1, schemaTypes.course_id),
  new Column(2, schemaTypes.time),
  new Column(3, schemaTypes.room),
  new Column(4, schemaTypes.instructor),
  new Column(5, schemaTypes.units),
  new Column(6, schemaTypes.enrollment_status),
]);

export const parseDiscussionTable = tableParser([
  new Column(1, schemaTypes.ccn),
  new Column(2, schemaTypes.section),
  new Column(3, schemaTypes.time),
  new Column(4, schemaTypes.room),
  new Column(5, schemaTypes.instructor),
  new Column(6, schemaTypes.enrollment_status),
]);
