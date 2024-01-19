(async () => {
    const { BrowsingHistoryPromise } = await importModule('BrowsingHistoryPromise');
    const BrowsingHistoryBase = await BrowsingHistoryPromise;
    
    const { $clone } = await importModule('Utils');

    const SEL_CARD_TEMPLATE = '[data-navigation-product-card]';
    const ATTR_RQ_SECTION_ID = 'rq-section-id';
    const PRODUCTS_LIMIT = 8;
    
    customElements.define('browsing-history-navigation', class extends BrowsingHistoryBase {
        elements = {
            cardsTemplate: '[data-cards-template]',
            fallbackTemplate: '[data-fallback-template]'
        }

        async render() {
            if (!this.history?.length) {
                this._showFallback();
                return;
            };
            await this._getProductCardTemplates(this.rqSectionId, SEL_CARD_TEMPLATE, PRODUCTS_LIMIT);
            this._updateLocalHistory();
            if (!this.$productCards.length) {
                this._showFallback();
                return; 
            }
            this._initContainer(this.$cardsTemplate);
            this._setContainerContent();
            this._showHistory(this.$cardsTemplate);
        }

        _showFallback() {
            this.replaceChild($clone(this.$fallbackTemplate), this.$fallbackTemplate);
        }

        get rqSectionId() {
            return this.getAttribute(ATTR_RQ_SECTION_ID)
        }
    })
})();