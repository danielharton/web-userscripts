// ==UserScript==
// @name        SoundCloud Player Tweaks (Autoplay, Anti-Nag, No Next)
// @namespace   Violentmonkey Scripts
// @match       *://soundcloud.com/*
// @grant       none
// @version     1.0
// @description Autoplays song on load, closes signup/nag popups, and disables continuous autoplay.
// ==/UserScript==

(function () {
    'use strict';

    let currentUrl = location.href;
    let hasAutoplayed = false;

    
    const selectors = {
        
        popups: [
            '.modal__closeButton',         
            '.signupBanner__close',        
            '.announcement__close',        
            '.cookieBanner__close',        
            'button[title="Close window"]' 
        ],

        
        autoplayNextActive: [
            '.playbackSoundBadge__autoplay .sc-toggle-active',
            '.sc-toggle-active[title*="Autoplay" i]',
            '.sc-toggle-active[aria-label*="Autoplay" i]'
        ],

        
        trackPlayBtn: '.fullListenHero__foreground .sc-button-play, .soundTitle__playButton .sc-button-play',
        globalPlayBtn: '.playControls__play'
    };

    
    function isTrackPage() {
        const pathParts = location.pathname.split('/').filter(Boolean);
        const nonTrackRoutes = ['discover', 'stream', 'you', 'popular', 'search', 'settings', 'messages', 'notifications'];
        return pathParts.length >= 2 && !nonTrackRoutes.includes(pathParts[0]);
    }

    function enforcePreferences() {
        
        selectors.popups.forEach(sel => {
            const btn = document.querySelector(sel);
            if (btn && btn.offsetParent !== null) { 
                btn.click();
            }
        });

        
        selectors.autoplayNextActive.forEach(sel => {
            const toggle = document.querySelector(sel);
            if (toggle && toggle.offsetParent !== null) {
                toggle.click();
            }
        });

        
        if (currentUrl !== location.href) {
            currentUrl = location.href;
            hasAutoplayed = false; 
        }

        
        if (!hasAutoplayed && isTrackPage()) {
            
            const trackPlay = document.querySelector(selectors.trackPlayBtn);
            const globalPlay = document.querySelector(selectors.globalPlayBtn);

            if (trackPlay && !trackPlay.classList.contains('sc-button-pause')) {
                trackPlay.click();
                hasAutoplayed = true;
            } else if (globalPlay && !globalPlay.classList.contains('playing')) {
                
                globalPlay.click();
                hasAutoplayed = true;
            } else if ((trackPlay && trackPlay.classList.contains('sc-button-pause')) ||
                (globalPlay && globalPlay.classList.contains('playing'))) {
                
                hasAutoplayed = true;
            }
        }
    }

    
    setInterval(enforcePreferences, 800);
})();