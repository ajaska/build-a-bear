import React from 'react';

function Footer() {
  return (
    <div className="footer">
      <button className="add-class-submit-button">Add Classes</button>
      <div><span>Enrolled units: <span className="color-blue">15.0</span> (12 + 3 w/l)<br/>Units remaining: <span className="color-red">1.0</span></span></div>
    </div>
  );
}

export default Footer;
