import ICAL from 'ical.js';
import { flatten } from '../helpers/flatten';

function sectionToEvent(section) {
  const event = new ICAL.Event();

  event.dtstamp = ICAL.Time.now();

  event.uid = `${section.dept}${section.deptNumber}${section.type}${section.ccn}v1@bear.plus`;

  // TODO: this may? be broken for people generating this in other timezones
  const startMinutes = section.time.start / 100 * 60;
  const endMinutes = section.time.end / 100 * 60;
  event.startDate = new ICAL.Time({
    year: 2017,
    month: 1,
    day: 17,
    hour: 0,
    minute: startMinutes,
  });
  event.endDate = new ICAL.Time({
    year: 2017,
    month: 1,
    day: 17,
    hour: 0,
    minute: endMinutes,
  });

  event.summary = `${section.dept} ${section.deptNumber} ${section.type}`;
  event.description = '' +
  `${section.dept} ${section.deptNumber} ${section.section}: ${section.time.toString()}\n` +
  `${section.room}\n` +
  `CCN: ${section.ccn}\n`;

  event.location = section.room;

  const recur = new ICAL.Recur({
    until: ICAL.Time.fromDateString('2017-04-28'),
    byday: section.time.days && section.time.days.match(/\w\w/g).map(day => day.toUpperCase()),
  }, 'WEEKLY');
  // https://github.com/mozilla-comm/ical.js/issues/271
  recur.freq = 'WEEKLY';
  event.component.addPropertyWithValue('rrule', recur);

  return event.component;
}

function courseToEvents(course) {
  return course.flatten()
               .filter(section => section.time && section.time.start)
               .map(section => sectionToEvent(section));
}

export function coursesToCal(courses) {
  const comp = new ICAL.Component(['vcalendar', [], []]);
  comp.updatePropertyWithValue('prodid', '-//Build-a-Bear Scheduler');
  flatten(courses.map(course => courseToEvents(course))).map(vevent =>
    comp.addSubcomponent(vevent)
  );
  return comp.toString();
}
