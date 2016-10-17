export const head = `
<link href='https://fonts.googleapis.com/css?family=Arimo:400,400italic,700,700italic' rel='stylesheet' type='text/css'>
<link rel="stylesheet" type="text/css" href="${ROOT_URL}/css/main.css">
<link rel="stylesheet" href="https://npmcdn.com/react-select/dist/react-select.css">
<title>Build-a-Bear</title>
`

export const body = `
<div class="banner">
  <img class="icon" src="${ROOT_URL}/assets/whitebear.svg" /><span class="text">Build-a-Bear</span>
</div>
<div class="main-container">
  <div class="my-academics-link-wrapper">
    <img class="icon" src="${ROOT_URL}/assets/backArrow.svg" /><a class="link" href="https://calcentral.berkeley.edu/academics"> Return to My Academics</a>
  </div>
  <div id="root"></div>
</div>
`
