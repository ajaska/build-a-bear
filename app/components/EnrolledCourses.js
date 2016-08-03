import React from 'react';

function joinWithBr(arr, property) {
  const items = [];
  if (arr.length === 0) {
    return items;
  }
  items.push(<span key={0}>{arr[0][property]}</span>);
  for (let i = 1; i < arr.length; ++i) {
    items.push(<br key={2 * i} />);
    items.push(<span key={2 * i + 1}>{arr[i][property]}</span>);
  }
  return items;
}

function EnrolledCourses({ courses }) {
  const sc = courses;
  const ec = Object.keys(sc).filter(course => sc[course][0].enrollment_status === 'Enrolled');
  const wc = Object.keys(sc).filter(course => sc[course][0].enrollment_status === 'Wait Listed');
  const genTable = (keys) => keys.map((key, i) => (
    <tr className="courses-table-entry" key={i}>
      <td className="class-drop">
        <a target="_blank" href="https://bcsweb.is.berkeley.edu/psc/bcsprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSR_SSENRL_DROP.GBL?ucFrom=CalCentral&ucFromLink=https://bear.plus&ucFromText=Class%20Enrollment">
          <i id="drop-class" className="courses-drop-course remove icon"></i>
        </a>
      </td>
      <td>{joinWithBr(sc[key], 'course')}</td>
      <td>{joinWithBr(sc[key], 'type')}</td>
      <td>{joinWithBr(sc[key], 'time')}</td>
      <td>{joinWithBr(sc[key], 'room')}</td>
      <td>{joinWithBr(sc[key], 'instructor')}</td>
      <td>{joinWithBr(sc[key], 'units')}</td>
      <td>{joinWithBr(sc[key], 'id')}</td>
    </tr>
  ));
  const enrolled = genTable(ec);
  const waitlisted = genTable(wc);

  return (
    <table className="courses-table-enroll">
      <thead>
        <tr className="courses-table-header-row">
          <th className="courses-table-header-drop-class">&nbsp;</th>
          <th>Class</th>
          <th>Type</th>
          <th>Time</th>
          <th>Room</th>
          <th>Instructor</th>
          <th>Units</th>
          <th>CCN</th>
        </tr>
      </thead>
      <tbody>
        {enrolled}
        <tr className="courses-table-waitlisted">
          <td>&nbsp;</td>
          <td>
            <div>
              <span className="courses-table-waitlisted-text">Waitlisted Classes</span>
            </div>
          </td>
          <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
          <td>&nbsp;</td><td>&nbsp;</td>
        </tr>
        {waitlisted}
      </tbody>
    </table>
  );
}

EnrolledCourses.propTypes = {
  courses: React.PropTypes.object.isRequired,
};

export default EnrolledCourses;
