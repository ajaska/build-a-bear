import React from 'react';

class ToGoogleCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickedAdd = this.handleClickedAdd.bind(this);
    console.log(this.props);
  }

  handleClickedAdd() {
    const download = document.createElement('a');
    download.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.props.calendarFileBody));
    download.setAttribute('download', 'CourseScheduleFa2016.ics');
    if (document.createEvent) {
      const event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      download.dispatchEvent(event);
    } else {
      download.click();
    }
    $('.google-cal-info').modal('show');
  }

  handleClickedClose() {
    $('.google-cal-info').modal('hide');
  }

  render() {
    return (
      <div>
        <div className="google-cal-panel">
          <button
            className="google-add-calendar-button"
            onClick={this.handleClickedAdd}
          >
            + Add Schedule to Google Calendar
          </button>
        </div>
        <div className="ui modal google-cal-info">
          <div className="modal-header headerfix">
            <span className="modal-header-text">Importing  to Google Calendar</span>
            <span className="modal-cancel">
              <i
                id="add-close"
                className="modal-cancel-icon remove icon"
                onClick={this.handleClickedClose}
              ></i>
            </span>
          </div>
          <p className="modal-confirm-text">You should see a download start. This file contains your course schedule in a CSV format. You can follow the simple steps <a className="semibold" target="_blank" href="https://digibites.zendesk.com/hc/en-us/articles/200134792-How-do-I-import-ics-ical-csv-files-into-Google-Calendar-">here</a> on how to use this file to import your class schedule into google calendar.</p>
        </div>
      </div>
    )
  }
}

export default ToGoogleCalendar;
