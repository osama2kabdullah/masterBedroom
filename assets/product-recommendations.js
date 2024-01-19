(async () => {
    const { Core } = await importModule('Core');
    const { 
        fetchHTML, 
        $isEmpty, 
        $show, 
        $clone,
        Routes
    } = await importModule('Utils');

    const ATTR_PRODUCT_ID = 'product-id';
    const ATTR_LIMIT = 'limit';
    const SEL_WRAPPER = '[data-swiper-wrapper]';

    const RQ_SECTION_ID = 'r_product-recommendations-slides';

    customElements.define('product-recommendations', class extends Core {
        elements = {
            template: '[data-template]'
        }

        async render() {
            this._initContainer();
            await this._setRecommendations();
            this._showRecommendations();
        }

        _initContainer() {
            this.$container = $clone(this.$template);
        }

        async _setRecommendations() {
            const $doc = await fetchHTML(`${Routes('productRecommendations')}?${this.fetchParams.toString()}`);
            const $section = $doc.getElementById(`shopify-section-${RQ_SECTION_ID}`);
            if ($isEmpty($section)) return this.getParentSection().remove();
            this.$container
                .querySelector(SEL_WRAPPER)
                .replaceChildren(...$section.cloneNode(true).childNodes);
        }

        _showRecommendations() {
            this.replaceChildren(...this.$container.childNodes);
            $show(this);
        }

        get fetchParams() {
            return new URLSearchParams({
                product_id: this.productId,
                limit: +this.limit,
                section_id: RQ_SECTION_ID
            });
        }

        get productId() {
            return this.getAttribute(ATTR_PRODUCT_ID);
        }

        get limit() {
            return this.getAttribute(ATTR_LIMIT);
        }
    })
})();