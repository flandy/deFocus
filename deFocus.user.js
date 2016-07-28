// ==UserScript==
// @name        deFocus
// @namespace   flandy.orz
// @description 去除网站自动focus
// @include     http://baike.baidu.com/*
// @include     http://www.zdfans.com/*
// @include     https://*.tmall.com/*
// @include     https://www.taobao.com/*
// @include     https://www.quora.com
// @version     1.1
// @run-at      document-idle
// @grant       none
// @updateURL https://github.com/flandy/user.js/raw/master/meta/deFocus.meta.js
// @downloadURL https://github.com/flandy/user.js/raw/master/deFocus.user.js
// ==/UserScript==

let dc = document.activeElement;
if( /^(input|textarea)$/i.test(dc.tagName))
{
	dc && dc.blur();
}
//document.body.focus();

let rules = [
	{
		url_reg: /^https?:\/\/\w+\.tmall\.com\//i,
		tar_sel: '#mq',
		interv: 16000 
	},
];

for(let rule of rules) {
	if(def_tracker(rule)) break;
}

// anti auto-refresh etc.
function def_tracker(rule) {
	if(rule.url_reg.test(document.URL)){
		let tar = document.querySelector(rule.tar_sel);
		// defocus on scroll
		let def_func = ()=>{
			tar.blur();
			//console.log('***catch one*** '+new Date());
		};
		window.addEventListener('scroll', def_func);
		// force defocus unless clicked into
		// otherwise will disable the inputbox for some time
		tar.onfocus = def_func;
		let clear_def = ()=>{tar.onfocus=function(){};};
		tar.addEventListener('mousedown', clear_def);
		// release listener
		setTimeout(()=>{
			clear_def();
			tar.removeEventListener('mousedown', clear_def, false);
		}, rule.interv);
		setTimeout(()=>{
			window.removeEventListener('scroll', def_func, false);
		}, 2*rule.interv);
		return true;
	}
	return false;
}