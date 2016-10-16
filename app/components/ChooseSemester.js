import React from 'react';

function ChooseSemester(props) {
  const chooseSemester = (
    <div className="choose-semester-page">
      <div className="container">
        <div className="icon-wrapper">
          <img className="icon" src={`${ROOT_URL}/assets/whitebear.svg`} role="presentation" />
        </div>
        <button className="semester-fall semibold">Fall 2016</button>
        <button className="semester-spring semibold">Spring 2017</button>
      </div>
    </div>
  );

  return props.term ? (<div>{props.children}</div>) : chooseSemester;
}

ChooseSemester.propTypes = {
  children: React.PropTypes.element.isRequired,
  term: React.PropTypes.string.isRequired,
};

export default ChooseSemester;
