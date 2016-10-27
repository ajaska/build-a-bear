import React from 'react';

function Calendar({ courses }) {
  const sc = courses;
  const rawLectures = Object.keys(sc).filter(course => sc[course].lecture);
  const rawSections = Object.keys(sc).filter(course => !sc[course].lecture);

  const earliestClassStartTime = Math.min(...sc.map(course => course.start));
  const latestClassEndTime = Math.max(...sc.map(course => course.start + course.length));

  const calendarHeight = ((latestClassEndTime - earliestClassStartTime) / 50) * 60 + 30;

  const heightFix = {
    height: `${calendarHeight}px`,
  };

  const lectures = rawLectures.map((lecture, i) => {
    const outerClassName = `${(sc[lecture].waitlisted ? 'waitlisted-course ' : '')}\
${sc[lecture].day} lecture-entry \
rel-start-${parseInt(sc[lecture].start, 10) - earliestClassStartTime + 650}`;
    return (
      <div className={outerClassName} key={i}>
        <div className="lecture-entry-header semibold">{sc[lecture].formatted}</div>
        <div className={`lecture-entry-body block-${sc[lecture].length}`}>
          {sc[lecture].desc}
          <br />
          {sc[lecture].room}
        </div>
        <div className="lecture-entry-footer"></div>
      </div>
    );
  });

  const others = rawSections.map((section, i) => {
    const outerClassName = `${(sc[section].waitlisted ? 'waitlisted-course ' : '')}\
${sc[section].day} other-entry \
rel-start-${(parseInt(sc[section].start, 10) - earliestClassStartTime + 650)}`;
    return (
      <div className={outerClassName} key={i}>
        <div className={`other-entry-body block-${sc[section].length}`}>
          <span className="semibold">{sc[section].formatted}</span>
          <br />
          {sc[section].desc}
          <br />
          {sc[section].room}
        </div>
      </div>
    );
  });

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

        {lectures}
        {others}

      </div>
    </div>
  );
}

Calendar.propTypes = {
  courses: React.PropTypes.array,
};

export default Calendar;
