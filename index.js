if (window.buildabearloaded) { throw new Error('Already running'); }
window.buildabearloaded = true;

import './app/helpers/formdata'; // FormData polyfill
import './app/helpers/analytics'; // Google Analytics

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './app/components/App';

import { head, body } from './html';

import { pages, parseResponse } from './app/lib/responseParser';
import { setSemester, setSemesterChoices } from './app/actions/semester';
import { setShoppingCart } from './app/actions/shoppingCart';
import { setEnrolledCourses } from './app/actions/enrolled';
import { setFormData } from './app/actions/api';

import configureStore from './app/store';

let info;

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

  info = parseResponse(document);
}

function goReact() {
  let store = configureStore();
  let promise;
  if (info.pageName === pages.MAIN_PAGE) {
    promise = Promise.all([
      store.dispatch(setShoppingCart({ courses: info.shoppingCartCourses })),
      store.dispatch(setEnrolledCourses({ courses: info.enrolledCourses })),
      store.dispatch(setFormData({ formData: info.formData })),
      store.dispatch(setSemester({ term: info.term, career: info.career })),
    ]);
  } else {
    console.log(info);
    promise = Promise.all([
      store.dispatch(setSemesterChoices({ choices: info.semesters })),
      store.dispatch(setFormData({ formData: info.formData })),
    ]);
  }

  promise.then(() => {
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
  alert('Failed to initialize?');
  throw e;
}
goReact();
