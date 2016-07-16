// ==UserScript==
// @name        Blacklist Blocker Mod
// @description Block page content by blacklist
// @namespace   qixinglu.com
// @grant       none
/// @require    https://raw.githubusercontent.com/muzuiget/greasemonkey-scripts/master/blacklist_blocker.user.js
// @include     http://www.smzdm.com/*
// @include     https://v2ex.com/*
// @note     	fork from muzuiget
// ==/UserScript==

;(function () {
	'use strict';
	
// funcs
	let to_regExp = p => {
		if(typeof(p) === 'string') return new RegExp(p);
		else return p;
	};
	
	let nodeFunc = {
		xcontains: function(selector, keywords) {
			if (!Array.isArray(keywords)) {
				keywords = [keywords];
			}
			for (let child of this.querySelectorAll(selector)) {
				let text = child.textContent;
				for (let keyword of keywords) {
					if (to_regExp(keyword).test(text)) {
						return true;
					}
				}
			}
			return false;
		},
	};
	
	let BlacklistBlocker = function(rules) {
	
		let mixin = function(target, mixinObject) {
			for (let [name, prop] of Iterator(mixinObject)) {
				target[name] = prop;
			}
		};
	
		let applyRule = function(rule) {
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
		
		let isMatchUrls = function(urls) {
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
	
		let avaiableRules = rules.filter((e) => isMatchUrls(e.urls));
		let run = () => avaiableRules.forEach(applyRule);
	
		let exports = {
			run: run,
		};
		return exports;
	};
	
// rules
	let rules = [
	{
		urls: ['http://www.smzdm.com/', 'http://fx.smzdm.com/'],	// 网址或正则
		test: false,		// 测试模式开启时将要被隐藏的内容红框标出显示
		node: '.leftWrap .list[articleid]',		// CSS限定作用范围，全网页开启可用'body *'
		hide: function(node) {
			let keywords = ['幼儿', '童', '婴儿','纸尿裤',];
			if(nodeFunc.xcontains.call(node, '.itemName', keywords))
				return true;
			
			return false;
		},
		watch: null,
	},
	{
		urls: /^https:\/\/v2ex.com\/$/i,
		test: true,
		node: '.cell.item',
		hide: function(node) {
			let keywords = [
				'二手交易', '小米', '红米',
				'如何评价', '如何看待', '怎么评价', '怎么看', '怎样理解',
			];
			if(nodeFunc.xcontains.call(node, 'table', keywords))
				return true;
			
			return false;
		}
	},
	];
	
// execute
	let blocker = BlacklistBlocker(rules);
	blocker.run();
	window.addEventListener('scroll', blocker.run);
})();