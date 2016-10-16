class Column {
  constructor() {
    if (this.parse === undefined) {
      throw new TypeError('Must override parse.');
    }
  }
}

function simpleColumn(name) {
  return class extends Column {
    parse(td) {
      return { [name]: td.innerText.trim() };
    }
  };
}

export const DaysTimes = simpleColumn('time');
export const Schedule = DaysTimes;
export const Instructor = simpleColumn('instructor');
export const Units = simpleColumn('units');
export const ClassNbr = simpleColumn('ccn');
export const Section = simpleColumn('section');
export const Room = simpleColumn('room');
export const Term = simpleColumn('term');
export const Career = simpleColumn('career');

export class Selectable extends Column {
  parse(td) {
    return { selectable: td.innerHTML.includes('checkbox') };
  }
}

export class Class extends Column {
  parse(td) {
    const selectable = td.innerHTML.includes('"PSHYPERLINK"');

    const text = td.innerText.trim();
    const re = /([\w]+)\W+([\d\w]+)-([\d\w]+)\W*\((\d+)\)/;
    const [, dept, deptNumber, section, ccn] = text.match(re);
    return { selectable, dept, deptNumber, section, ccn };
  }
}

export class Description extends Column {
  parse(td) {
    const text = td.innerText.trim();
    const re = /(.*)\s\((.+)\)/;
    const [, desc, type] = text.match(re);
    return { desc, type };
  }
}

export class EnrollmentStatus extends Column {
  parse(td) {
    const enrollmentStatuses = [
      'Wait Listed',
      'Enrolled',
      'Dropped',
    ];
    for (let i = 0; i < enrollmentStatuses.length; i++) {
      const cur = enrollmentStatuses[i];
      if (td.innerHTML.includes(cur)) {
        return { enrollmentStatus: cur };
      }
    }
    return { enrollmentStatus: 'Unknown' };
  }
}

export class Noop extends Column {
  parse() {
    return { };
  }
}

export class AvailabilityStatus extends Column {
  parse(td) {
    const availabilityStatuses = [
      'Wait List',
      'Closed',
      'Open',
    ];
    for (let i = 0; i < availabilityStatuses.length; i++) {
      const cur = availabilityStatuses[i];
      if (td.innerHTML.includes(cur)) {
        return { availability: cur };
      }
    }
    return { availability: 'Unknown' };
  }
}
