// ==UserScript==
// @name         YouTube Channel Trailer: Auto-Pause, Unmute & Dynamic UI
// @namespace    Userscripts
// @version      1.3.0
// @description  Pauses channel trailers, unmutes them, shows fullscreen, and makes top buttons fade naturally.
// @match        *://*.youtube.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    let lastProcessedUrl = '';

    function injectCSS() {
        if (document.getElementById('yt-channel-player-css')) return;
        const style = document.createElement('style');
        style.id = 'yt-channel-player-css';
        style.textContent = `
            
            ytd-channel-video-player-renderer .ytp-fullscreen-button {
                display: inline-block !important;
                opacity: 1 !important;
                visibility: visible !important;
                pointer-events: auto !important;
            }
            
            ytd-channel-video-player-renderer .ytp-right-controls {
                display: flex !important;
                opacity: 1 !important;
                visibility: visible !important;
            }

            
            ytd-channel-video-player-renderer .ytp-watch-later-button,
            ytd-channel-video-player-renderer .ytp-share-button {
                transition: opacity 0.25s cubic-bezier(0.0,0.0,0.2,1) !important;
                opacity: 1 !important;
            }

            
            ytd-channel-video-player-renderer .ytp-autohide .ytp-watch-later-button,
            ytd-channel-video-player-renderer .ytp-autohide .ytp-share-button {
                opacity: 0 !important;
                pointer-events: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    function handleChannelPlayer() {
        const path = window.location.pathname;
        if (!path.startsWith('/@') && !path.startsWith('/c/') && !path.startsWith('/channel/') && !path.startsWith('/user/')) {
            return;
        }

        const channelPlayerRenderer = document.querySelector('ytd-channel-video-player-renderer');
        if (!channelPlayerRenderer) return;

        const video = channelPlayerRenderer.querySelector('video');
        const player = channelPlayerRenderer.querySelector('.html5-video-player');

        if (video && player) {
            if (lastProcessedUrl === window.location.href) return;

            if (typeof player.unMute === 'function') {
                player.unMute();
            }
            video.muted = false;

            if (typeof player.pauseVideo === 'function') {
                player.pauseVideo();
            } else {
                video.pause();
            }

            lastProcessedUrl = window.location.href;
        }
    }

    
    injectCSS();

    
    window.addEventListener('yt-navigate-finish', () => {
        lastProcessedUrl = '';
        setTimeout(handleChannelPlayer, 100);
        setTimeout(handleChannelPlayer, 500);
        setTimeout(handleChannelPlayer, 1500);
    });

    
    const observer = new MutationObserver(() => {
        if (document.querySelector('ytd-channel-video-player-renderer video')) {
            handleChannelPlayer();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();