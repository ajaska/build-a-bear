import React from 'react';
import $ from 'jquery'; // eslint-disable-line import/no-unresolved

import CoursePicker from '../containers/CoursePicker';

class Footer extends React.Component {
  handleFooterClick() {
    $('.add-course-mobile').modal('show');
  }

  render() {
    return (
      <div className="footer">
        <button
          className="add-class-mobile-button"
          onClick={this.handleFooterClick}
        >
          Add Classes
        </button>
        <div className="ui modal add-course-mobile">
          <CoursePicker />
        </div>
      </div>
    );
  }
}
// <div><span>Enrolled units: <span className="color-blue">15.0</span> (12 + 3 w/l)<br/>Units remaining: <span className="color-red">1.0</span></span></div>

export default Footer;
