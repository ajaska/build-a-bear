if (window.buildabearloaded) { throw new Error('Already running'); }
window.buildabearloaded = true;

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './app/components/App';

import { head, body } from './html';

import { parseResponse } from './app/lib/responseParser';
import { setShoppingCart } from './app/actions/shoppingCart';
import { setEnrolledCourses } from './app/actions/enrolled';
import { setFormData } from './app/actions/api';

import configureStore from './app/store';

let formData = new FormData();
let enrolledCourses = [];
let shoppingCartCourses = [];

function initialize() {
  // Remove any existing setInterval calls
  for (let i = 1; i < 99999; i++) {
    window.clearInterval(i);
  }

  document.querySelector('head').innerHTML = head;

  ({ formData, enrolledCourses, shoppingCartCourses } = parseResponse(document));
}

function goReact() {
  let store = configureStore();
  Promise.all([
    store.dispatch(setShoppingCart({ courses: shoppingCartCourses })),
    store.dispatch(setEnrolledCourses({ courses: enrolledCourses })),
    store.dispatch(setFormData({ formData })),
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

initialize();
goReact();
