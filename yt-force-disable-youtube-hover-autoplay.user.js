// ==UserScript==
// @name         Force Disable YouTube Hover Autoplay (Debug)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Aggressively removes YouTube inline preview players + extensive console logging.
// @match        *://*.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let removedCount = 0;              
    let mutationsHandled = 0;         

    console.log('[KILL PREVIEW] Script started (document-start).');

    
    function killPreviews(caller) {
        const start = performance.now();
        const previews = document.querySelectorAll(
            'ytd-video-preview, .ytd-video-preview, #mouseover-overlay'
        );

        let removedNow = 0;
        previews.forEach(el => {
            el.remove();
            removedNow++;
            removedCount++;
        });

        if (removedNow > 0) {
            const elapsed = (performance.now() - start).toFixed(2);
            console.log(
                `[KILL PREVIEW] [${caller}] Removed ${removedNow} element(s) in ${elapsed}ms. Total removed so far: ${removedCount}`
            );
        }
    }

    
    const observedNode = document.documentElement;   
    console.log('[KILL PREVIEW] Setting up MutationObserver on', observedNode);

    const observer = new MutationObserver((mutations) => {
        mutationsHandled++;
        
        
        if (mutationsHandled % 5 === 0) {
            console.log(`[KILL PREVIEW] MutationObserver fired (batch #${mutationsHandled}, ${mutations.length} mutations this time).`);
        }
        killPreviews('observer');
    });

    try {
        observer.observe(observedNode, {
            childList: true,
            subtree: true
        });
        console.log('[KILL PREVIEW] Observer started successfully.');
    } catch (e) {
        console.error('[KILL PREVIEW] Failed to start observer:', e);
    }

    
    let intervalId;
    function startFallback() {
        console.log('[KILL PREVIEW] Starting fallback interval (every 2000ms).');
        intervalId = setInterval(() => killPreviews('interval'), 2000);
    }

    
    if (document.body) {
        startFallback();
    } else {
        
        const bodyObserver = new MutationObserver(() => {
            if (document.body) {
                bodyObserver.disconnect();
                startFallback();
            }
        });
        bodyObserver.observe(observedNode, { childList: true, subtree: true });
    }

    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('[KILL PREVIEW] DOMContentLoaded – running initial sweep.');
            killPreviews('DOMContentLoaded');
        });
    } else {
        killPreviews('immediate');
    }

    
    window.addEventListener('beforeunload', () => {
        clearInterval(intervalId);
        observer.disconnect();
        console.log('[KILL PREVIEW] Script cleanup. Total elements removed:', removedCount);
    });

    console.log('[KILL PREVIEW] Setup complete.');
})();