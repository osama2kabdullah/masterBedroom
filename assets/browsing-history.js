(async () => {
    const { BrowsingHistoryPromise } = await importModule('BrowsingHistoryPromise');
    const BrowsingHistoryBase = await BrowsingHistoryPromise;

    const SEL_WRAPPER = '[data-swiper-wrapper]';
    const SEL_CARD_SLIDE_TEMPLATE = '[data-card-slide]';
    const RQ_SECTION_ID = 'r_product-card';
    
    customElements.define('browsing-history', class extends BrowsingHistoryBase {
        elements = {
            template: '[data-template]'
        }

        async render() {
            if (!this.history?.length) {
                this.getParentSection().remove();
                return;
            };
            await this._getProductCardTemplates(RQ_SECTION_ID, SEL_CARD_SLIDE_TEMPLATE);
            this._initContainer(this.$template);
            this._setContainerContent(SEL_WRAPPER);
            this._showHistory(this.$template);
            this._updateLocalHistory();
        }
    })
})();