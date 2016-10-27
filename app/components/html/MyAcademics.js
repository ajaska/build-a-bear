import React from 'react';

function MyAcademics() {
  return (
    <div className="my-academics-link-wrapper">
      <img className="icon" src={`${ROOT_URL}/assets/backArrow.svg`} role="presentation" />
      <a className="link" href="https://calcentral.berkeley.edu/academics"> Return to My Academics</a>
    </div>
  );
}

export default MyAcademics;
