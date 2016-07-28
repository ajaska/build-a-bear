if (window.buildabearloaded) { throw new Error('Already running'); }
window.buildabearloaded = true;

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './app/components/App';

import { head, body } from './html';

import { parseEnrolledCoursesTable, parseShoppingCartTable } from './app/lib/tableParsers';
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

  formData = new FormData(document.getElementById('SSR_SSENRL_CART'));
  const enrolledTableRows = document.querySelectorAll("tr [id^='trSTDNT_ENRL_SSVW']");
  const shoppingCartTableRows = document.querySelectorAll("tr [id^='trSSR_REGFORM_VW']");
  if (enrolledTableRows.length > 0) {
    enrolledCourses = parseEnrolledCoursesTable(enrolledTableRows);
  }
  if (shoppingCartTableRows.length > 0 &&
      !shoppingCartTableRows[0].innerText.includes('shopping cart is empty')) {
    shoppingCartCourses = parseShoppingCartTable(shoppingCartTableRows);
  }
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
