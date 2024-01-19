(async () => {
    const { Core } = await importModule('Core');
    const { $show, $clone } = await importModule('Utils');
    
    const ATTR_RECENT_SEARCH_LIMIT = 'limit';
    const LS_RECENT_SEARCHES = 'recent-searches';

    customElements.define('predictive-search-recent-searches', class extends Core {
        elements = {
            itemTemplate: '[data-list-item-template]',
            ul: '[data-recents-list]',
        }

        subscriptions = {
            'search:query': '_updateRecentSearches'
        }

        render() {
            this.subscribe('search:query');
            this._renderList();
        }

        _renderList() {
            if (this.recentSearches.length) {
                this.recentSearches.map(reqText => {   
                    this.$ul.appendChild(this._renderListItem(reqText));
                });
                $show(this);
            };
        }

        _renderListItem(itemText) {
            const $item = $clone(this.$itemTemplate).firstElementChild;
            const $itemSlot = $item.querySelector('slot[name=query]');
            $itemSlot.replaceWith(itemText);
            $item.addEventListener('click', () => {
                this.publish('recentSearches:select', {value: itemText})
            })
            return $item;
        }

        _updateRecentSearches({ query }) {
            if (!query) return;
            let newStore = [...new Set([query, ...this.recentSearches])];
            if (newStore.length > this.limit) newStore.length = this.limit;
            localStorage.setItem(LS_RECENT_SEARCHES, JSON.stringify(newStore));
        }
        
        get recentSearches() {
            const lsData = localStorage.getItem(LS_RECENT_SEARCHES);
            return lsData ? JSON.parse(lsData) : [];
        }
        
        get limit() {
            return this.getAttribute(ATTR_RECENT_SEARCH_LIMIT);
        }
        
    })
})();