// ==UserScript==
// @name         Auto Reject YouTube Cookies
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks "Reject all" on YouTube's consent popup.
// @match        *://*.youtube.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    
    const targetAriaLabel = "Reject the use of cookies and other data for the purposes described";

    function clickRejectAll() {
        
        const rejectBtn = document.querySelector(`button[aria-label="${targetAriaLabel}"]`);

        
        const fallbackBtn = document.querySelector('tp-yt-paper-dialog.ytd-consent-bump-v2-lightbox .eom-button-row ytd-button-renderer:first-child button');

        const buttonToClick = rejectBtn || fallbackBtn;

        if (buttonToClick && buttonToClick.offsetParent !== null) { 
            buttonToClick.click();
            console.log('[Auto Reject] Clicked "Reject All" button.');
            return true;
        }
        return false;
    }

    
    if (!clickRejectAll()) {

        
        const observer = new MutationObserver((mutations, obs) => {
            for (let mutation of mutations) {
                if (mutation.addedNodes.length) {
                    if (clickRejectAll()) {
                        
                        obs.disconnect();
                        return;
                    }
                }
            }
        });

        
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();