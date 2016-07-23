import React from 'react';
import ShoppingCart from '../containers/ShoppingCart'
import EnrolledCourses from '../containers/EnrolledCourses'

class App extends React.Component {
  render() {
    return (
      <div>
        <ShoppingCart />
        <EnrolledCourses />
      </div>
    )
  }
}

export default App;
