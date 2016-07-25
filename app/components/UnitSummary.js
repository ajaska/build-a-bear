import React from 'react';

class UnitSummary extends React.Component {
  render() {
    let total = 1*this.props.enrolledUnits + 1*this.props.waitlistedUnits;
    let remaining = this.props.maxUnits - total;
    return (
      <div className="units-summary-panel">
        <p className="units-text"><span className="units-header-text">You are currently enrolled in:</span>
        <br />
        <span className="units-total">{ total } units</span> ({this.props.enrolledUnits} + {this.props.waitlistedUnits} w/l)
        <br />
        <span className="units-remaining">{ remaining }</span> units remaining</p>
      </div>
    )
  }
}

export default UnitSummary;
