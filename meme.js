var loadingMessage = document.createElement("div");
loadingMessage.style.cssText='position:absolute;top:0;left:0;bottom:0;right:0;overflow:auto;background:white;'
loadingMessage.innerText = "Loading, please wait.";
document.body.appendChild(loadingMessage);

var loading = document.createElement("script");
loading.src = '//js.six.ph/meme-app.js';
document.body.appendChild(loading);
