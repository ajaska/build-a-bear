import React, { PropTypes } from 'react';

function joinWithBr(arr, property) {
  let items = [];
  if (arr.length === 0) {
    return items;
  }
  items.push(<span key={0}>{arr[0][property]}</span>);
  for(let i=1; i<arr.length; ++i) {
    items.push(<br key={2*i} />)
    items.push(<span key={2*i+1}>{arr[i][property]}</span>);
  }
  return items;
}

class EnrolledCourses extends React.Component {
  render() {
    let sc = this.props.courses;
    let ec = Object.keys(sc).filter(course => sc[course][0].enrollment_status === 'Enrolled');
    let wc = Object.keys(sc).filter(course => sc[course][0].enrollment_status === 'Wait Listed');
    const gen_table = (keys) => keys.map((key, i) => {
        return (
         <tr className="courses-table-entry" key={i}>
          <td className="class-drop"><i id="drop-class" className="courses-drop-course remove icon"></i></td>
          <td>{ joinWithBr(sc[key], 'course') }</td>
          <td>{ joinWithBr(sc[key], 'type') }</td>
          <td>{ joinWithBr(sc[key], 'time') }</td>
          <td>{ joinWithBr(sc[key], 'room') }</td>
          <td>{ joinWithBr(sc[key], 'instructor') }</td>
          <td>{ joinWithBr(sc[key], 'units') }</td>
          <td>{ joinWithBr(sc[key], 'id') }</td>
          <td>{ joinWithBr(sc[key], 'enrollment_status') }</td>
        </tr>
       )
          // <td>&nbsp; <br /><button className="discussion-swap">Swap</button></td>
    });
    let enrolled = gen_table(ec);
    let waitlisted = gen_table(wc);

            // <th>&nbsp;</th>
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
            <th>Waitlist</th>
          </tr>
        </thead>
        <tbody>
          { enrolled }
          <tr className="courses-table-waitlisted">
            <td>&nbsp;</td>
            <td>
              <div>
                <p>Waitlisted Classes</p>
              </div>
            </td>
            <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
          </tr>
          { waitlisted }
        </tbody>
      </table>
    )//<td>&nbsp;</td>
  }
}

EnrolledCourses.propTypes = {
  courses: PropTypes.object.isRequired
}

export default EnrolledCourses;
