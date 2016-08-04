import React from 'react';

function UnitSummary({ enrolledUnits, waitlistedUnits, maxUnits }) {
  const total = 1 * enrolledUnits + 1 * waitlistedUnits;
  const remaining = maxUnits - total;
  return (
    <div className="units-summary-panel">
      <p className="units-text">
        <span className="units-header-text">You are currently enrolled in:&nbsp;</span>
        <br />
        <span className="color-blue">{total} units</span>
        ({enrolledUnits} + {waitlistedUnits} w/l)
        <br />
        <span className="color-red">{remaining}</span> units remaining
      </p>
    </div>
  );
}

UnitSummary.propTypes = {
  enrolledUnits: React.PropTypes.number.isRequired,
  maxUnits: React.PropTypes.number.isRequired,
  waitlistedUnits: React.PropTypes.number.isRequired,
};

export default UnitSummary;
