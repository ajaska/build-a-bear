import React from 'react';

function Calendar({ courses }) {
  console.log(courses);
  const sc = courses;
  console.log(sc[0].lecture);
  const lecture = Object.keys(sc).filter(course => sc[course].lecture);
  const other = Object.keys(sc).filter(course => !sc[course].lecture);
  const genEntries = (key) => key.map((key, i) => (
    <div className={sc[key].day + " lecture-entry monday start-" + sc[key].start} key={i}>
      <div className="lecture-entry-header semibold">{sc[key].start}</div>
      <div className={"lecture-entry-body block-" + (parseInt(sc[key].length) / 30)}>{sc[key].desc} <br />{sc[key].room} </div>
      <div className="lecture-entry-footer"></div>
    </div>
  ));

  const lectures = genEntries(lecture);

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

        <div className="other-entry monday am-830">
          <div className="other-entry-body block-4"><span className="semibold">11 - 1PM</span> <br />Math 113 Lec 006 <br /> 420 Cory Hall</div>
        </div>

      </div>
    </div>
  )
}

export default Calendar;
