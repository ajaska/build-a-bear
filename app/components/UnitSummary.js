import React from 'react';

class UnitSummary extends React.Component {
  render() {
    return (
      <div className="units-summary-panel">
        <p className="units-text"><span className="units-header-text">You are currently enrolled in:</span>
        <br />
        <span className="units-total">10.0 units</span> (4.0 + 6.0 w/l)
        <br />
        <span className="units-remaining">6.0 units</span> remaining</p>
      </div>
    )
  }
}

export default UnitSummary;
