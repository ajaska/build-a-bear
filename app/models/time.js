function timeToInt(time, am) {
  let timeInt = parseInt(time.replace(':', ''), 10);
  if (!am && Math.floor(timeInt / 100) !== 12) {
    timeInt = timeInt + 1200;
  }
  if (timeInt % 10 === 9) {
    timeInt = timeInt + 1;
  }
  if (timeInt % 100 === 30) {
    timeInt = timeInt + 20;
  }
  if (timeInt % 100 === 60) {
    timeInt = timeInt + 100 - 60;
  }
  return timeInt;
}

function prettyTime(start, end) {
  const startHour = (Math.floor(start / 100) - 1) % 12 + 1;
  const startMin = start % 100;
  const startAM = start < 1200 ? 'AM' : 'PM';
  const endHour = (Math.floor(end / 100) - 1) % 12 + 1;
  const endMin = end % 100;
  const endAM = end < 1200 ? 'AM' : 'PM';

  let startString;
  if (startMin === 0) {
    startString = `${startHour}`;
  } else if (startMin === 50) {
    startString = `${startHour}:30`;
  } else {
    startString = `${startHour}:${startMin}`;
  }

  let endString;
  if (endMin === 0) {
    endString = `${endHour}`;
  } else if (endMin === 50) {
    endString = `${endHour}:30`;
  } else {
    endString = `${endHour}:${endMin}`;
  }

  if (startAM === endAM) {
    return `${startString}-${endString} ${endAM}`;
  }
  return `${startString} ${startAM} - ${endString} ${endAM}`;
}

function normalizeTime(timeString) {
  const re = /((?:Mo|Tu|We|Th|Fr|Sa|Su)+) (\d?\d:\d\d)(AM|PM) - (\d?\d:\d\d)(AM|PM)/;
  const re2 = /((?:M|T|W|R|F|S|U)+) (\d?\d:\d\d)((?:AM|PM)?) - (\d?\d:\d\d)((?:AM|PM)?)/;
  const matches = timeString.match(re) || timeString.match(re2);
  if (!matches || matches.length !== 6) {
    return timeString;
  }
  const [days, startTime, startAM, endTime, endAM] = matches.slice(1);
  const start = timeToInt(startTime, startAM !== 'PM');
  const end = timeToInt(endTime, endAM !== 'PM');
  let normalizedDays = days;
  if (timeString.match(re2)) {
    normalizedDays = days.replace('M', 'Mo')
                         .replace('T', 'Tu')
                         .replace('W', 'We')
                         .replace('R', 'Th')
                         .replace('F', 'Fr')
                         .replace('S', 'Sa')
                         .replace('U', 'Su');
  }
  return { normalizedDays, start, end };
}

export class Time {
  constructor(timeString) {
    this.timeString = timeString;
    const { normalizedDays, start, end } = normalizeTime(timeString);
    this.days = normalizedDays;
    this.start = start;
    this.end = end;
  }

  get daysArray() {
    return this.days && this.days.match(/\w\w/g) || [];
  }

  toString() {
    if (!this.days || !this.start || !this.end) {
      return '';
    }
    const formattedTime = prettyTime(this.start, this.end);
    return `${this.days} ${formattedTime}`;
  }
}
