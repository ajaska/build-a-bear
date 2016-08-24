import React from 'react';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickedAdd = this.handleClickedAdd.bind(this);
  }

  handleClickedAdd() {
    $('.course-picker-modal').modal('show');
  }

  render() {
    return (
      <div className="footer">
        <button
          className="add-class-submit-button"
          onClick={this.handleClickedAdd}
        >
          Add Class
        </button>
        <div><span>Enrolled units: <span className="color-blue">15.0</span> (12 + 3 w/l)<br/>Units remaining: <span className="color-red">1.0</span></span></div>
      </div>
    );
  }
}

export default Footer;
