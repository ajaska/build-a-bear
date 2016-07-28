import React from 'react';

class ShoppingCart extends React.Component {
  onAddClick(ccn, event) {
    this.props.setCCN({ccn: ccn.toString()});
  }

  render() {
    if (!this.props.courses || this.props.courses.length === 0) {
      return (<div>debug info: no courses in shopping cart</div>)
    }

    let course_rows = this.props.courses.filter(course=>course.selectable).map((course, i) => {
      return (
        <div className="sc-class-item" key={i}>
          <span className="sc-course-info-name semibold">{course.course} <span className="color-blue">({course.units} Units)</span></span>
          <div className="sc-course-info clearfix">
            <div className="sc-course-info-left">
              <span className="semibold">{course.room}</span><br /><span>{course.time}</span><br />
              <span>Instructor: </span><span className="semibold">{course.instructor}</span>
            </div>
            <div className="sc-course-info-right">
              <button className="sc-course-delete">Delete</button>
              <button className="sc-course-add" onClick={this.onAddClick.bind(this, course.id)}>Add</button>
            </div>
          </div>
        </div>
      )
    });
    return (
      <div className="sc-panel">
        <p className="sc-header-text">This app doesn't use shopping cart, but we noticed you already have these classes in it:</p>
        { course_rows }
        <div className="sc-foot clearfix">
          <span className="sc-clear-text">You can either add these classes or clear your cart.</span>
        </div>
      </div>
    )
  }
}

ShoppingCart.propTypes = {
  courses: React.PropTypes.array.isRequired
}

export default ShoppingCart;
