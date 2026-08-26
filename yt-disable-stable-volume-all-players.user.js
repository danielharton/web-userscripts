// ==UserScript==
// @name        YouTube: Disable VOLUME_STABLE (All Players)
// @namespace   Violentmonkey Scripts
// @match       *://www.youtube.com/*
// @match       *://www.youtube-nocookie.com/*
// @grant       none
// @version     0.3.0
// @description To disable stable volume (Drc Audio) on all players including channel trailers
// @run-at      document-start
// @unwrap
// @require     https://update.greasyfork.org/scripts/475632/1361351/ytConfigHacks.js
// @inject-into page
// @license     MIT
// ==/UserScript==

window._ytConfigHacks.add((config_) => {
    let configs = (config_ || 0).WEB_PLAYER_CONTEXT_CONFIGS || {};



    Object.values(configs).forEach(o => {
        if (o && typeof o.serializedExperimentFlags === 'string' && o.serializedExperimentFlags.length > 25) {
            o.serializedExperimentFlags = `&${o.serializedExperimentFlags}&`
                .replace('&html5_show_drc_toggle=true&', '&')
                .slice(1, -1);
        }
    });
});