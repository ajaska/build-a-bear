import { Time } from './time';
import { shortenRoom } from '../helpers/everything';

class Base {
  constructor(params = {}) {
    this.ccn = params.ccn;
    this.dept = params.dept;
    this.deptNumber = params.deptNumber;
    this.section = params.section;
    this.type = params.type;
    this.desc = params.desc;
    this.room = shortenRoom(params.room);
    this.time = new Time(params.time);
    this.instructor = params.instructor;
    this.enrollmentStatus = params.enrollmentStatus;
    this.availability = params.availability;
  }

  get courseName() {
    return `${this.dept} ${this.deptNumber}-${this.section}`;
  }
}

export class Lecture extends Base {
  constructor(params = {}) {
    super(params);
    this.units = params.units;
  }

  toString() {
    return `LEC ${this.section} - ${this.room} - ${this.time} - ${this.instructor}`;
  }
}

export class Section extends Base {
  constructor(params = {}) {
    super(params);
  }

  toString() {
    return `DIS ${this.section} - ${this.room} - ${this.time} - ${this.instructor}`;
  }
}

export class Course {
  constructor({ lecture, sections }) {
    this.lecture = lecture;
    this.sections = sections;
  }

  flatten() {
    return [].concat(this.lecture, this.sections);
  }
}
