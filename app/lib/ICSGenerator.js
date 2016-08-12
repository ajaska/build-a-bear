import ical from 'ical-generator';
import { flatten } from '../helpers/flatten';

function timeToRepeating(time) {
  const repeating = {};
  repeating.freq = 'weekly';
  repeating.until = new Date('2016-12-10');
  repeating.byDay = time.days && time.days.match(/\w\w/g).map(day => day.toLowerCase());
  return repeating;
}

function sectionToEvent(section) {
  const calEvent = {};

  // The month column is 0 indexed, everything else is 1-indexed, fucking incredible
  // TODO: this will be broken for people generating this in other timezones
  const startMinutes = section.time.start / 100 * 60;
  const endMinutes = section.time.end / 100 * 60;
  calEvent.start = new Date(2016, 8 - 1, 24, 0, startMinutes);
  calEvent.end = new Date(2016, 8 - 1, 24, 0, endMinutes);
  calEvent.repeating = timeToRepeating(section.time);

  calEvent.summary = `${section.dept} ${section.deptNumber} ${section.type}`;
  calEvent.description = '' +
  `${section.dept} ${section.deptNumber} ${section.section}: ${section.time.toString()}\n` +
  `${section.room}\n` +
  `CCN: ${section.ccn}\n`;

  calEvent.location = section.room;

  return calEvent;
}

function courseToEvents(course) {
  return course.flatten()
               .filter(section => section.time && section.time.start)
               .map(section => sectionToEvent(section));
}

export function coursesToCal(courses) {
  return ical({
    domain: 'berkeley.edu',
    events: flatten(courses.map(course => courseToEvents(course))),
  }).toString();
}
