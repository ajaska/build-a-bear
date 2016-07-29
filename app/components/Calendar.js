import React from 'react';

class Calendar extends React.Component {
  render() {
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

          <div className="lecture-entry monday am-630">
            <div className="lecture-entry-header semibold">9 - 11AM</div>
            <div className="lecture-entry-body block-4">Math 113 Lec 006 <br /> 420 Cory Hall</div>
            <div className="lecture-entry-footer"></div>
          </div>

          <div className="lecture-entry thursday am-11">
            <div className="lecture-entry-header semibold">9 - 11AM</div>
            <div className="lecture-entry-body block-2">Math 113 Lec 006 <br /> 420 Cory Hall</div>
            <div className="lecture-entry-footer"></div>
          </div>

          <div className=" lecture-entry wednesday am-11">
            <div className="lecture-entry-header semibold">9 - 11AM</div>
            <div className="lecture-entry-body block-3">Math 113 Lec 006 <br /> 420 Cory Hall</div>
            <div className="lecture-entry-footer"></div>
          </div>

          <div className="other-entry monday am-830">
            <div className="other-entry-body block-4"><span className="semibold">11 - 1PM</span> <br />Math 113 Lec 006 <br /> 420 Cory Hall</div>
          </div>
        </div>
      </div>
    )
  }
}

export default Calendar;
