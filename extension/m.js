var c =document.createElement("div");c.style.cssText='position:absolute;top:0;left:0;right:0;background:white;height:100%;width:100%;display:flex;justify-content:center;align-items:center;';var l =document.createElement("div");l.style.cssText='text-align:center';var p =document.createElement("p");p.style.cssText='color:#4279FF;font-size:1.2rem;';p.innerText='Build-a-Bear';var q =document.createElement("p");q.style.cssText='font-size:1.5rem;font-family:"Calibre-Semibold",sans-serif;';q.innerText='Loading, please wait...';l.appendChild(p);l.appendChild(q);c.appendChild(l);document.body.appendChild(c);
var k=['https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js','//bear.plus/scripts/semantic/modal.min.js','//bear.plus/scripts/semantic/dimmer.min.js','//bear.plus/scripts/semantic/transition.min.js','//bear.plus/app.js'];for(var i=0;i<k.length;i++){var j=document.createElement("script");j.src=k[i];j.async=false;document.body.appendChild(j);}
var o=document.createElement("script");o.text="window.ICAL=0;chrome.browserAction.onClicked.addListener(function(tab) { alert('icon clicked')});"document.body.appendChild(o);
