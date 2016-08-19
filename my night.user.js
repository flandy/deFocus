// ==UserScript==
// @name         my night
// @include      http://*
// @include      https://*
// @description  night read
// @run-at       document-idle
// ==/UserScript==

var set = 0;

function isAutorun() {
	var h = new Date().getHours();
	return h >= 0  &&  h <= 7;
}

/* if(window.location.href.indexOf("http://example.com/") != -1) set=1; */
if(!set && !isAutorun()) return;

var night = function (w) {
	(function (d) {
		var css = 'html{opacity:0.6!important;background:black!important;}body{background:white!important;}';
		var s = d.getElementsByTagName('style');
		for (var i = 0, si; si = s[i]; i++) {
			if (si.innerHTML == css) {
				si.parentNode.removeChild(si);
				return
			}
		};
		var heads = d.getElementsByTagName('head');
		if (heads.length) {
			var node = d.createElement('style');
			node.type = 'text/css';
			node.appendChild(d.createTextNode(css));
			heads[0].appendChild(node)
		}
	})(w.document);
	for (var i = 0, f; f = w.frames[i]; i++) {
		try {
			arguments.callee(f)
		} catch (e) {}

	}
};

// avoid running on frames
try{
	if(top === self)
		night(window);
}catch(e){
	return;
}