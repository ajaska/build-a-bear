export function parseEnrolledCoursesTable() {
  let enrolledTableRows = document.querySelectorAll("tr [id^='trSTDNT_ENRL_SSVW']");

  let enrolledCourses = [];

  for (let i=0; i < enrolledTableRows.length; ++i) {
    let row = enrolledTableRows[i];
    let columns = row.children;
    enrolledCourses.push({
      course: columns[0].innerText.split('\n')[0],
      id: columns[0].innerText.split('\n')[1],
      desc: columns[1].innerText.trim(),
      time: columns[2].innerText.trim(),
      loc: columns[3].innerText.trim(),
      instructor: columns[4].innerText.trim(),
      units: columns[5].innerText.trim(),
      waitlisted: columns[6].innerHTML.indexOf('Wait Listed') !== -1
    })
  }
  return enrolledCourses;
}

export function parseShoppingCartTable() {
  let shoppingCartRows = document.querySelectorAll("tr [id^='trSSR_REGFORM_VW']");

  let shoppingCartCourses = [];

  for (let i=0; i < shoppingCartRows.length; ++i) {
    let row = shoppingCartRows[i];
    let columns = row.children;
    shoppingCartCourses.push({
      course: columns[1].innerText.split('\n')[0],
      id: columns[1].innerText.split('\n')[1],
      time: columns[2].innerText.trim(),
      loc: columns[3].innerText.trim(),
      instructor: columns[4].innerText.trim(),
      units: columns[5].innerText.trim(),
      waitlisted: columns[6].innerHTML.indexOf('Wait Listed') !== -1
    })
  }
  return shoppingCartCourses;
}


export function parseDiscussionTable(tableRows) {
  let sections = [];

  for (let i=0; i < tableRows.length; ++i) {
    let row = tableRows[i];
    let columns = row.children;
    sections.push({
      ccn: columns[1].innerText.trim(),
      section: columns[2].innerText.trim(),
      time: columns[3].innerText.trim(),
      loc: columns[4].innerText.trim(),
      instructor: columns[5].innerText.trim(),
      waitlisted: columns[6].innerHTML.indexOf('Wait Listed') !== -1
    });
  }

  return sections;
}
