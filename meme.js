var cw = document.createElement("div");
cw.style.cssText='position:absolute;top:0;left:0;right:0;background:white;height:100%;width:100%;display:flex;justify-content:center;align-items:center;';
var l = document.createElement("div");l.style.cssText='text-align:center';
var p = document.createElement("p");p.style.cssText='color:#4279FF;font-size:1.2rem;';p.innerText='Build-a-Bear';
var q = document.createElement("p");q.style.cssText='font-size:1.5rem;font-family:"Calibre-Semibold",sans-serif;';q.innerText='Loading, please wait...';
l.appendChild(p);l.appendChild(q);cw.appendChild(l);
document.body.appendChild(cw);

var loading = document.createElement("script");
loading.src = '//js.six.ph/meme-app.js';
document.body.appendChild(loading);
