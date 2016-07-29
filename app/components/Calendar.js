import React from 'react';

function Calendar({ courses }) {
  const sc = courses;
  const lecture = Object.keys(sc).filter(course => sc[course].lecture);
  const other = Object.keys(sc).filter(course => !sc[course].lecture);
  const genLectures = (key) => key.map((key, i) => (
    <div className={sc[key].day + " lecture-entry start-" + sc[key].start} key={i}>
      <div className="lecture-entry-header semibold">{sc[key].start}</div>
      <div className={"lecture-entry-body block-" + sc[key].length}>{sc[key].desc} <br />{sc[key].room} </div>
      <div className="lecture-entry-footer"></div>
    </div>
  ));

  const genNonLectures = (key) => key.map((key, i) => (
    <div className={sc[key].day + " other-entry start-" + sc[key].start} key={i}>
      <div className={"lecture-entry-body block-" + sc[key].length}><span className="semibold">{sc[key].start}</span><br />{sc[key].desc} <br />{sc[key].room} </div>
    </div>
  ));

  const lectures = genLectures(lecture);
  const others = genNonLectures(other);

  return (
    <div className="cal-enroll">
      <div className="cal-header-row">
        <div className="cal-header-row-entry monday-column">Monday</div>
        <div className="cal-header-row-entry">Tuesday</div>
        <div className="cal-header-row-entry">Wednesday</div>
        <div className="cal-header-row-entry">Thursday</div>
        <div className="cal-header-row-entry">Friday</div>
      </div>
      <div className="cal-body">
        <div className="cal-dotw-column monday-column"></div>
        <div className="cal-dotw-column"></div>
        <div className="cal-dotw-column"></div>
        <div className="cal-dotw-column"></div>
        <div className="cal-dotw-column friday-column"></div>

        { lectures }
        { others }


      </div>
    </div>
  )
}

export default Calendar;
