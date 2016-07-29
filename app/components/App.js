import React from 'react';
import ShoppingCart from '../containers/ShoppingCart';
import EnrolledCourses from '../containers/EnrolledCourses';
import CoursePicker from '../containers/CoursePicker';
import UnitSummary from '../containers/UnitSummary';
import AddCourseModal from '../containers/AddCourseModal';
import Calendar from '../containers/Calendar';

function App() {
  return (
    <div>
      <AddCourseModal />
      <div className="main-data-container">
        <EnrolledCourses />
        <Calendar />
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
