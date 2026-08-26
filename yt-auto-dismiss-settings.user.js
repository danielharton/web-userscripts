// ==UserScript==
// @name         Auto-Dismiss YouTube Settings Popup
// @namespace    Violentmonkey Scripts
// @match        *://*.youtube.com/*
// @grant        none
// @version      1.0
// @description  Automatically clicks "Got it" on the "We've changed some of your settings" popup.
// ==/UserScript==

(function () {
    'use strict';

    
    const dismissPopup = () => {
        
        const gotItButton = document.querySelector('button[aria-label="Got it"].ytSpecButtonShapeNextHost');

        
        if (gotItButton && gotItButton.offsetParent !== null) {
            gotItButton.click();
            console.log('Auto-dismissed YouTube settings popup.');
        }
    };

    
    const observer = new MutationObserver((mutations) => {
        
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                dismissPopup();
            }
        }
    });

    
    observer.observe(document.body, { childList: true, subtree: true });

    
    dismissPopup();

})();