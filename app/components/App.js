import React from 'react';
import ShoppingCart from '../containers/ShoppingCart'
import EnrolledCourses from '../containers/EnrolledCourses'
import CoursePicker from '../containers/CoursePicker';

class App extends React.Component {
  render() {
    return (
      <div>
        <ShoppingCart />
        <EnrolledCourses />
        <CoursePicker />
      </div>
    )
  }
}

export default App;
