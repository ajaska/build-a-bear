if (window.buildabearloaded) { throw new Error('Already running'); }
window.buildabearloaded = true;

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './app/components/App';

import { head, body } from './html';

import { parseResponse } from './app/lib/responseParser';
import { setSemester } from './app/actions/semester';
import { setShoppingCart } from './app/actions/shoppingCart';
import { setEnrolledCourses } from './app/actions/enrolled';
import { setFormData } from './app/actions/api';

import configureStore from './app/store';

let formData = new FormData();
let enrolledCourses = [];
let shoppingCartCourses = [];
let term, course;

function initialize() {
  // Remove any existing setInterval calls
  for (let i = 1; i < 99999; i++) {
    window.clearInterval(i);
  }

  // Remove any existing setTimeout calls
  let id = window.setTimeout(() => {}, 0);
  while (id--) {
    window.clearTimeout(id);
  }

  document.querySelector('head').innerHTML = head;

  ({ formData, enrolledCourses, shoppingCartCourses, term, course } = parseResponse(document));
}

function goReact() {
  let store = configureStore();
  Promise.all([
    store.dispatch(setShoppingCart({ courses: shoppingCartCourses })),
    store.dispatch(setEnrolledCourses({ courses: enrolledCourses })),
    store.dispatch(setFormData({ formData })),
    store.dispatch(setSemester({ term, course })),
  ]).then(() => {
    document.querySelector('body').innerHTML = body;
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById('root')
    );
  });
}

try {
  initialize();
} catch (e) {
  alert("Failed to initialize?");
  throw e;
}
goReact();
