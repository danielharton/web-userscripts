// ==UserScript==
// @name         YouTube - Remove Auto-Dubbed Label
// @namespace    Violentmonkey Scripts
// @match        https://www.youtube.com/*
// @grant        none
// @version      1.0
// @description  Removes the "Auto-dubbed" label from recommended videos without affecting other badges.
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    function removeAutoDubbedLabels() {
        
        const labels = document.querySelectorAll('.ytBadgeShapeText');

        labels.forEach(label => {
            
            if (label.textContent.trim() === 'Auto-dubbed') {
                
                const badgeContainer = label.closest('.ytContentMetadataViewModelBadge') || label.closest('yt-badge-view-model');
                if (badgeContainer) {
                    badgeContainer.remove();
                }
            }
        });
    }

    
    removeAutoDubbedLabels();

    
    const observer = new MutationObserver(() => {
        removeAutoDubbedLabels();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();