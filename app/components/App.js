import React from 'react';
import ShoppingCart from '../containers/ShoppingCart'
import EnrolledCourses from '../containers/EnrolledCourses'
import CoursePicker from '../containers/CoursePicker';
import UnitSummary from '../containers/UnitSummary';

class App extends React.Component {
  render() {
    return (
      <div>
        <div className="left-data-container">
          <EnrolledCourses />
        </div>
        <div className="side-panel-container">
          <CoursePicker />
          <UnitSummary />
          <ShoppingCart />
        </div>
      </div>
    )
  }
}

export default App;
