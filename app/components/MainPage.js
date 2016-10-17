import React from 'react';
import ShoppingCart from '../containers/ShoppingCart';
import EnrolledCourses from '../containers/EnrolledCourses';
import CoursePicker from '../containers/CoursePicker';
import UnitSummary from '../containers/UnitSummary';
import AddCourseModal from '../containers/AddCourseModal';
import Calendar from '../containers/Calendar';
import Footer from '../components/Footer';
import SemesterHeader from '../containers/SemesterHeader';
import ToGoogleCalendar from '../components/ToGoogleCalendar';
import Banner from '../components/html/Banner';
import MyAcademics from '../components/html/MyAcademics';

function MainPage() {
  return (
    <div>
      <Banner />
      <div className="main-container">
        <MyAcademics />
        <div>
          <div>
            <p className="class-enrollment-subtitle semibold">Class Enrollment</p>
          </div>
          <div>
            <AddCourseModal />
            <SemesterHeader />
            <div className="main-data-container">
              <EnrolledCourses />
              <Calendar />
            </div>
            <div className="side-panel-container">
              <ToGoogleCalendar />
              <CoursePicker />
              <UnitSummary />
              <ShoppingCart />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default MainPage;