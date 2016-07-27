import React from 'react';
import ShoppingCart from '../containers/ShoppingCart';
import EnrolledCourses from '../containers/EnrolledCourses';
import CoursePicker from '../containers/CoursePicker';
import UnitSummary from '../containers/UnitSummary';
import AddCourseModal from '../containers/AddCourseModal';

function App() {
  return (
    <div>
      <AddCourseModal />
      <div className="main-data-container">
        <EnrolledCourses />
      </div>
      <div className="side-panel-container">
        <CoursePicker />
        <UnitSummary />
        <ShoppingCart />
      </div>
    </div>
  );
}

export default App;
