if (window.buildabearloaded) { throw "Already running"; }
window.buildabearloaded = true;

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './app/components/App'

import { head, body } from './html'

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

  document.querySelector('head').innerHTML = head;

  formData = new FormData(document.getElementById('SSR_SSENRL_CART'));
  let enrolledTableRows = document.querySelectorAll("tr [id^='trSTDNT_ENRL_SSVW']");
  let shoppingCartTableRows = document.querySelectorAll("tr [id^='trSSR_REGFORM_VW']");
  if (enrolledTableRows.length > 0) {
    enrolledCourses = parseEnrolledCoursesTable(enrolledTableRows);
  }
  if (shoppingCartTableRows.length > 0) {
    shoppingCartCourses = parseShoppingCartTable(shoppingCartTableRows);
  }

  const scriptsToAdd = [
    "https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js",
    "//js.six.ph/scripts/semantic/modal.min.js",
    "//js.six.ph/scripts/semantic/dropdown.min.js",
    "//js.six.ph/scripts/semantic/dimmer.min.js",
    "//js.six.ph/scripts/semantic/transition.min.js",
    //"//js.six.ph/scripts/main.js"
  ];
  for (let i=0; i<scriptsToAdd.length; ++i) {
    let script = document.createElement('script');
    script.src = scriptsToAdd[i];
    script.type = "text/javascript";
    script.async = false;
    document.head.appendChild(script);
  }
}

initialize();

let store = configureStore();
Promise.all([
  store.dispatch(setShoppingCart({courses: shoppingCartCourses})),
  store.dispatch(setEnrolledCourses({courses: enrolledCourses})),
  store.dispatch(setFormData({formData: formData})),
]).then(() => {
  document.querySelector('body').innerHTML = body;
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
})
