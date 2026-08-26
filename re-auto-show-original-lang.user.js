// ==UserScript==
// @name         Reddit Auto Show Original Language
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Automatically appends ?show=original to Reddit post URLs to bypass IP-based automatic translation on both normal and old.reddit.
// @match        *://*.reddit.com/*
// @match        *://old.reddit.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    function enforceOriginalLanguage() {
        
        if (window.location.pathname.match(/^\/r\/[a-zA-Z0-9_]+\/comments\//)) {
            const url = new URL(window.location.href);

            
            if (url.searchParams.get('show') !== 'original') {
                url.searchParams.set('show', 'original');
                window.location.replace(url.toString()); 
            }
        }
    }

    
    enforceOriginalLanguage();

    
    let lastUrl = window.location.href;
    const observer = new MutationObserver(() => {
        const currentUrl = window.location.href;
        
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            enforceOriginalLanguage();
        }
    });

    
    if (document.head || document.body) {
        observer.observe(document, { subtree: true, childList: true });
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            observer.observe(document, { subtree: true, childList: true });
        });
    }

})();