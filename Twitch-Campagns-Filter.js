// ==UserScript==
// @name         Twitch Drop Campaigns Filter
// @version      1.3
// @description  Filtre les Drops Twitch selon une liste de noms spécifiques
// @author       Guiguille
// @match        https://www.twitch.tv/drops/campaigns
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const gamesFilter = ['Overwatch 2', 'Shakes and Fidget', 'Sea Of Thieves'];
    let isFiltering = true;

    function shouldKeepDrop(gameName) {
        return gamesFilter.some(filter => gameName.includes(filter));
    }

    function filterDrops(forceShow = false) {
        const dropItems = document.querySelectorAll('.accordion-header');
        dropItems.forEach(item => {
            const gameLink = item.querySelector('.tw-title');
            if (!gameLink) return;

            const gameName = gameLink.textContent.trim();
            const shouldShow = forceShow || shouldKeepDrop(gameName);

            item.parentNode.style.display =  shouldShow ? '' : 'none';
        });
    }

    function createFilterButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.style = `
            position: fixed;
            top: 60px;
            right: 10px;
            background: #18181b;
            padding: 10px;
            border-radius: 5px;
            z-index: 9999;
            color: white;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            display: flex;
            flex-direction: column;
            gap: 5px;
        `;

        const refreshButton = document.createElement('button');
        refreshButton.textContent = 'Filtrer les Campagnes';
        refreshButton.style = `
            background: #9147ff;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            transition: background 0.2s;
        `;
        refreshButton.onmouseover = () => refreshButton.style.background = '#7d2df0';
        refreshButton.onmouseout = () => refreshButton.style.background = '#9147ff';
        refreshButton.onclick = () => {
            isFiltering = true;
            filterDrops(false);
        };

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Réinitialiser le Filtrage';
        resetButton.style = `
            background: #2f2f35;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            transition: background 0.2s;
        `;
        resetButton.onmouseover = () => resetButton.style.background = '#3e3e42';
        resetButton.onmouseout = () => resetButton.style.background = '#2f2f35';
        resetButton.onclick = () => {
            isFiltering = false;
            filterDrops(true);
        };

        const reloadButton = document.createElement('button');
        reloadButton.textContent = 'Rafraîchir la Page';
        reloadButton.style = `
            background: #2f2f35;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            transition: background 0.2s;
        `;
        reloadButton.onmouseover = () => reloadButton.style.background = '#3e3e42';
        reloadButton.onmouseout = () => reloadButton.style.background = '#2f2f35';
        reloadButton.onclick = () => {
            location.reload();
        };

        buttonContainer.appendChild(refreshButton);
        buttonContainer.appendChild(resetButton);
        buttonContainer.appendChild(reloadButton);
        document.body.appendChild(buttonContainer);
    }

    function observeDropsLoad() {
        const observer = new MutationObserver(() => {
            if (document.querySelectorAll('.accordion-header').length > 0) {
                filterDrops();
                observer.disconnect(); // Arrête l'observation une fois les éléments trouvés
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    createFilterButtons();
    observeDropsLoad(); // Active le filtrage dès le chargement de la page
})();
