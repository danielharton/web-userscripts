// ==UserScript==
// @name        YouTube Auto "More Options"
// @namespace   Violentmonkey Scripts
// @match       *://*.youtube.com/*
// @grant       none
// @version     1.0
// @description Automatically clicks the "More options" button on YouTube's cookie consent dialog.
// ==/UserScript==

(function () {
    'use strict';

    
    const buttonSelector = 'ytd-consent-bump-v2-lightbox a[aria-label="More options"][href*="consent.youtube.com"]';

    const clickMoreOptions = () => {
        const moreOptionsBtn = document.querySelector(buttonSelector);
        if (moreOptionsBtn) {
            moreOptionsBtn.click();
            return true; 
        }
        return false;
    };

    
    if (clickMoreOptions()) return;

    
    const observer = new MutationObserver((mutations, obs) => {
        if (clickMoreOptions()) {
            obs.disconnect(); 
        }
    });

    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    
    
    setTimeout(() => {
        observer.disconnect();
    }, 10000);

})();