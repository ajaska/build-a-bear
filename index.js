import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './app/components/App'

import { parseEnrolledCoursesTable, parseShoppingCartTable } from './app/lib/tableParsers';
import { setShoppingCart } from './app/actions/shoppingCart';
import { setEnrolledCourses } from './app/actions/enrolled';
import { setFormData, addFromShoppingCart } from './app/actions/api';

import configureStore from './app/store';

let formData = new FormData();
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

let store = configureStore();
Promise.all([
  store.dispatch(setShoppingCart({courses: shoppingCartCourses})),
  store.dispatch(setEnrolledCourses({courses: enrolledCourses})),
  store.dispatch(setFormData({formData: formData})),
]).then(() => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
}).then(() => {
  store.dispatch(addFromShoppingCart({
    formData: formData,
    positions: [0, 2, 3],
    positionToEnroll: 3,
  }))
})



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
