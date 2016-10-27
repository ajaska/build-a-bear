import React from 'react';

function Banner() {
  return (
    <div className="banner">
      <img className="icon" src={`${ROOT_URL}/assets/whitebear.svg`} role="presentation" />
      <span className="text">Build-a-Bear</span>
    </div>
  );
}

export default Banner;
