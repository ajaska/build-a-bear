import React from 'react';

function ChooseSemester(props) {
  const buttons = props.choices.map((choice, i) => (
    <button
      key={i}
      className="semester-fall semibold"
      onClick={(() => props.selectedSemester({term: choice.term}))}
    >
      {choice.term}
    </button>
  ));

  const chooseSemester = (
    <div className="choose-semester-page">
      <div className="container">
        <div className="icon-wrapper">
          <img className="icon" src={`${ROOT_URL}/assets/whitebear.svg`} role="presentation" />
        </div>
        {buttons}
      </div>
    </div>
  );

  return props.term ? (<div>{props.children}</div>) : chooseSemester;
}

ChooseSemester.propTypes = {
  children: React.PropTypes.element.isRequired,
  choices: React.PropTypes.array.isRequired,
  selectedSemester: React.PropTypes.func.isRequired,
  term: React.PropTypes.string.isRequired,
};

export default ChooseSemester;
/*
        <button className="semester-fall semibold">Fall 2016</button>
        <button className="semester-spring semibold">Spring 2017</button>
*/
