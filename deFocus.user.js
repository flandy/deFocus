// ==UserScript==
// @name        deFocus
// @namespace   flandy.orz
// @description 去除网站自动focus
// @include     http://baike.baidu.com/*
// @include     http://www.zdfans.com/*
// @version     1.0
// @run-at      document-idle
// @grant       none
// ==/UserScript==

var dc = document.activeElement;
if(dc.tagName.toLowerCase() == "input")
{
	dc.blur();
}
