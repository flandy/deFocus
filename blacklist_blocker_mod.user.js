// ==UserScript==
// @name	Blacklist Blocker Mod
// @description	Block page content by blacklist
// @namespace	flandy
// @include	http://www.smzdm.com/*
// @include	http://faxian.smzdm.com/*
// @include	/^https?:\/\/(?:www\.)?v2ex\.com\/$/
/// @include	http://tieba.baidu.com/f?kw=*
// @include	http://tieba.baidu.com/p/*
// @version	1.0
// @grant	none
// @run-at	document-start
// @updateURL	https://github.com/flandy/user.js/raw/master/meta/blacklist_blocker_mod.meta.js
// @downloadURL	https://github.com/flandy/user.js/raw/master/blacklist_blocker_mod.user.js
// @note	ref: https://raw.githubusercontent.com/muzuiget/greasemonkey-scripts/master/blacklist_blocker.user.js
// ==/UserScript==

// rules
let rules = [{
		urls : ['http://www.smzdm.com/', 'http://faxian.smzdm.com/'], // 网址或正则
		test : false, // 测试模式 开启时会用红框标出要被隐藏的内容
		node : '#feed-main-list>.feed-row-wide,.leftWrap.discovery_list>.list', // CSS限定作用范围，全网页开启可用'body *'
		observe : true,	// 监测DOM变化，可传入{tar:..,opt:{..}}
		hide : function (node) {	// 满足屏蔽条件返回true
			let keywords = [/[婴幼](?:儿|用品)/, '纸尿裤',];
			if (xcontains.call(node, '.feed-block-title, .z-feed-title,.listItem>.itemName', keywords))
				return true;
			return false;
		},
	}, {
		urls : /^https?:\/\/(?:www\.)?v2ex\.com\/$/i,
		test : true,
		node : '.cell.item',
		hide : function (node) {
			let keywords = [
				'二手交易', /[小红]米/, 'vmware', 
				/(?:如何|怎么|怎样)(?:评价|看)/,
			];
			if (xcontains.call(node, 'table', keywords))
				return true;
			return false;
		}
	}, {
		urls : /^http:\/\/tieba\.baidu\.com\/f\?kw=*/i,
		test : true,
		node : '#pagelet_live\\/pagelet\\/live',
		hide : function (node) {
			if (!xcontains.call(node, ' .topic_thread_danmu'))
				return true;
			return false;
		}
	}, { // ref: p/4735922851
		urls : /^http:\/\/tieba\.baidu\.com\/p\/*/i,
		node : '.l_post',
		observe : {tar : '#j_p_postlist'},
		hide : function (node) {
			var json = null;
			try {
				json = JSON.parse(node.dataset.field);
			} catch (ex) {
				return false;
			}
			return json.author.user_id == json.content.post_id || 
				json.content.thread_id == json.content.post_id;
		}
	},
];

// execute
addEventListener('DOMContentLoaded', BlacklistBlocker(rules).run);


// funcs
function to_regExp(p) {
	if (typeof(p) === 'string')
		return new RegExp(p);
	else
		return p;
}

function xcontains(selector, keywords) {
	// only use selector
	if (arguments.length === 1) {
		return !!this.querySelector(selector);
	}
	if (!Array.isArray(keywords)) {
		keywords = [keywords];
	}
	for (let child of this.querySelectorAll(selector)) {
		let text = child.textContent.trim();
		for (let keyword of keywords) {
			if (to_regExp(keyword).test(text)) {
				return true;
			}
		}
	}
	return false;
}
	
function BlacklistBlocker(rules) {
	'use strict';
	
	let applyRule = function (rule) {
		for (let node of document.querySelectorAll(rule.node)) {
			if (!rule.hide(node)) {
				continue;
			}
			if (rule.test) {
				node.style.boxShadow = '0 0 2px 2px #FF5555';
			} else {
				node.remove();
			}
		}
	};
	let addWatch = function (rule) {
		var watchContent = rule.observe;
		if(!watchContent) return;
		var tar = document.querySelector(watchContent.tar),
			opt = watchContent.opt;
		tar = tar || document.querySelector(rule.node).parentNode;
		opt = opt || {childList: true};
		
		var obv = new MutationObserver(()=>applyRule(rule));
		obv.observe(tar, opt);
		return obv;		// disconnect() can be used elsewhere
	};
	
	let isMatchUrls = function (urls) {
		if (!Array.isArray(urls)) {
			urls = [urls];
		}
		for (let url of urls) {
			if (to_regExp(url).test(location.href)) {
				return true;
			}
		}
		return false;
	};
	let avaiableRules = rules.filter(e => isMatchUrls(e.urls));
	
	let run = function(){
		avaiableRules.forEach(function(rule){
			applyRule(rule);
			addWatch(rule);
		});
	};
	let exports = {
		run : run,
	};
	return exports;
}
