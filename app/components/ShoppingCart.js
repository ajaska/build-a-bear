import React, { PropTypes } from 'react';

class ShoppingCart extends React.Component {
  render() {
    if (!this.props.courses || this.props.courses.size === 0) {
      return (<div>No courses</div>)
    }

    let course_header = Object.keys(this.props.courses[0]).map(
      (key, i) => <th key={i}>{ key }</th>
    );
    let course_rows = this.props.courses.map((row, i) => {
      return <tr key={i}>{Object.keys(row).map((key, i) => <td key={i}>{row[key]}</td>)}</tr>
    });
    return (
      <div>
        <div>
          This is the shopping cart.
        </div>
        <div>
          <table>
            <thead>
              <tr>{course_header}</tr>
            </thead>
            <tbody>{course_rows}</tbody>
          </table>
        </div>
      </div>
    )
  }
}

ShoppingCart.propTypes = {
  courses: PropTypes.array.isRequired
}

export default ShoppingCart;
