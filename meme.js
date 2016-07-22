var loadingMessage = document.createElement("div");
loadingMessage.innerHTML = "<div style='position:fixed;top:0;left:0;bottom:0;right:0;overflow:auto;'>Loading, please wait.</div>";
document.body.appendChild(loadingMessage);

var loading = document.createElement("script");
loading.src = '//js.six.ph/meme-app.js';
document.body.appendChild(loading);
