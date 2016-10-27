import React from 'react';

function Calendar({ courses }) {
  const sc = courses;
  const lecture = Object.keys(sc).filter(course => sc[course].lecture);
  const other = Object.keys(sc).filter(course => !sc[course].lecture);

  let earliestClassStartTime = Math.min.apply(Math, sc.map( function(a) {return a.start;} ));
  let latestClassEndTime = Math.max.apply(Math, sc.map( function(b) {return b.start + b.length;} ));

  let calendarHeight = ((latestClassEndTime - earliestClassStartTime) / 50) * 60 + 30;

  var heightFix = {
    height: '' + calendarHeight + 'px',
  };

  const genLectures = (key) => key.map((key, i) => (
    <div className={(sc[key].waitlisted ? 'waitlisted-course ' : '') + sc[key].day + " lecture-entry rel-start-" + (parseInt(sc[key].start) - earliestClassStartTime + 650)} key={i}>
      <div className="lecture-entry-header semibold">{sc[key].formatted}</div>
      <div className={"lecture-entry-body block-" + sc[key].length}>{sc[key].desc} <br />{sc[key].room} </div>
      <div className="lecture-entry-footer"></div>
    </div>
  ));

  const genNonLectures = (key) => key.map((key, i) => (
    <div className={(sc[key].waitlisted ? 'waitlisted-course ' : '') + sc[key].day + " other-entry rel-start-" + (parseInt(sc[key].start) - earliestClassStartTime + 650)} key={i}>
      <div className={"other-entry-body block-" + sc[key].length}><span className="semibold">{sc[key].formatted}</span><br />{sc[key].desc} <br />{sc[key].room} </div>
    </div>
  ));

  const lectures = genLectures(lecture);
  const others = genNonLectures(other);

  return (
    <div className="cal-enroll">
      <div className="cal-header-row">
        <div className="cal-header-row-entry monday-column border-radius-top-left">Monday</div>
        <div className="cal-header-row-entry">Tuesday</div>
        <div className="cal-header-row-entry">Wednesday</div>
        <div className="cal-header-row-entry">Thursday</div>
        <div className="cal-header-row-entry border-radius-top-right">Friday</div>
      </div>
      <div style={heightFix} className="cal-body">
        <div className="cal-dotw-column monday-column border-radius-bot-left"></div>
        <div className="cal-dotw-column"></div>
        <div className="cal-dotw-column"></div>
        <div className="cal-dotw-column"></div>
        <div className="cal-dotw-column friday-column border-radius-bot-right"></div>

        { lectures }
        { others }

      </div>
    </div>
  )
}

export default Calendar;
