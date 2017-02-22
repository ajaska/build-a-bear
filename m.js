document.domain='is.berkeley.edu';
var f = document.getElementById('ptifrmtgtframe');
f.addEventListener('load', function(){w = f.contentWindow || f, doc = f.contentDocument || w.document; var i='//bear.plus/i.js', s=doc.createElement("script"); s.src=i;doc.body.appendChild(s); var e = document.getElementById('ptbr_header_container'); e.parentNode.removeChild(e); });
