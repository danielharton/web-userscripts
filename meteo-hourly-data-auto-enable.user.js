// ==UserScript==
// @name         Meteoblue Hourly Data Auto-Enable (extendview)
// @namespace    Violentmonkey Scripts
// @version      1.1
// @description  Automatically sets the extendview cookie to true before page load for hourly weather data.
// @match        *://*.meteoblue.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    
    if (!document.cookie.includes('extendview=true')) {
        
        
        
        
        
        document.cookie = "extendview=true; path=/; domain=.meteoblue.com; max-age=31536000; SameSite=Lax";

        
        
        window.location.reload();
    }
})();