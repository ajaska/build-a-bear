import React from 'react';

class ShoppingCart extends React.Component {
  constructor(props) {
    super(props);
    this.onAddClick = this.onAddClick.bind(this);
    this.onDropClick = this.onDropClick.bind(this);
  }

  onDropClick({ ccn }) {
    this.props.dropCartCourse({ ccn });
  }

  onAddClick(ccn) {
    this.props.setCCN({ ccn: ccn.toString() });
  }

  render() {
    if (!this.props.courses || this.props.courses.length === 0) {
      return null;
    }

    const courseRows = this.props.courses.map(course => course.lecture).map((course, i) => (
      <div className="sc-class-item" key={i}>
        <span className="sc-course-info-name semibold">{course.courseName}
          <span className="color-blue">&nbsp;({course.units} Units)</span>
        </span>
        <div className="sc-course-info clearfix">
          <div className="sc-course-info-left">
            <span className="semibold">{course.room}</span><br /><span>{course.time.toString()}</span><br />
            <span>Instructor: </span><span className="semibold">{course.instructor}</span>
          </div>
          <div className="sc-course-info-right">
            <button
              className="sc-course-delete"
              onClick={() => this.onDropClick({ ccn: course.ccn })}
              disabled={this.props.disabled}
            >
              Delete
            </button>
            <button
              className="sc-course-add"
              onClick={() => this.onAddClick(course.ccn)}
              disabled={this.props.disabled}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    ));
    return (
      <div className="sc-panel">
        <p className="sc-header-text">
          This app doesn't have a shopping cart, but we noticed
          you already have these classes in it:
        </p>
        {courseRows}
        <div className="sc-foot clearfix">
          <span className="sc-clear-text">
            You can either add these classes or clear your cart.
          </span>
        </div>
      </div>
    );
  }
}

ShoppingCart.propTypes = {
  courses: React.PropTypes.array.isRequired,
  setCCN: React.PropTypes.func.isRequired,
  dropCartCourse: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool.isRequired,
};

export default ShoppingCart;
