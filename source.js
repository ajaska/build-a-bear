import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';

import { parseEnrolledCoursesTable, parseShoppingCartTable } from './tableParsers';
import { getSectionsForCCN, selectSection, confirmChoice } from './actions';


let formData = [];
let enrolledCourses = [];
let shoppingCartCourses = [];


function initialize() {
  // Remove any existing setInterval calls
  for (var i = 1; i < 99999; i++) {
    window.clearInterval(i);
  }

  formData = new FormData(document.getElementById('SSR_SSENRL_CART'));
  let enrolledTableRows = document.querySelectorAll("tr [id^='trSTDNT_ENRL_SSVW']");
  let shoppingCartTableRows = document.querySelectorAll("tr [id^='trSSR_REGFORM_VW']");
  enrolledCourses = parseEnrolledCoursesTable(enrolledTableRows);
  shoppingCartCourses = parseShoppingCartTable(shoppingCartTableRows);

  document.querySelector('html').innerHTML = '<!doctype html><html><head><title>Schedule Builder</title></head><body><div id="root"></div></body></html>';
}

initialize();


class App extends React.Component {
  render() {
    return (
      <div>
        <ShoppingCart courses={ shoppingCartCourses } />
        <EnrolledCourses courses={ enrolledCourses } />
      </div>
    )
  }
}


class ShoppingCart extends React.Component {
  render() {
    if (!this.props.courses) {
      return <div>No courses</div>
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


class EnrolledCourses extends React.Component {
  render() {
    if (!this.props.courses) {
      return <div>No courses</div>
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
          This is the enrolled courses.
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


/*
getSectionsForCCN(33647, formData).then(function({ formData, sections }) {
  return selectSection(0, formData);
}).then(function({formData}) {
  return confirmChoice(formData);
}).then(function({formData, courses}) {
  console.log(shoppingCartCourses);
  console.log(courses);
})
*/

let root = document.getElementById('root');

ReactDOM.render(
  <App />,
  root
);
