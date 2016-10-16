import React from 'react';

function ChooseSemester() {
  return (
    <div className="choose-semester-page">
      <div className="container">
        <div className="icon-wrapper">
          <img className="icon" src="../../assets/whitebear.svg" />
        </div>
        <button className="semester-fall semibold">Fall 2016</button>
        <button className="semester-spring semibold">Spring 2017</button>
      </div>
    </div>
  );
}

ChooseSemester.propTypes = {

};

export default ChooseSemester;
