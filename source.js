import $ from 'jquery';
import { parseEnrolledCoursesTable, parseShoppingCartTable } from './tableParsers';
import { getSectionsForCCN } from './actions';

for (var i = 1; i < 99999; i++) {
        window.clearInterval(i);
}

let initialCartFormData = new FormData(document.getElementById('SSR_SSENRL_CART'));

let enrolledCourses = parseEnrolledCoursesTable();
let shoppingCartCourses = parseShoppingCartTable();
document.querySelector('html').innerHTML = "<pre>"+JSON.stringify(enrolledCourses, null, '\t')+"</pre>";
document.querySelector('html').innerHTML += "<pre>"+JSON.stringify(shoppingCartCourses, null, '\t')+"</pre>";

getSectionsForCCN(33647, initialCartFormData).then(function({ formData, sections }) {
  document.querySelector('html').innerHTML += "<pre>"+JSON.stringify(sections, null, '\t')+"</pre>";
})
