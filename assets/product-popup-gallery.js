(async () => {
    const { Core } = await importModule('Core');
    const { Swiper } = await importModule('Swiper');
    
    const ATTR_INITIAL_VARIANT_ID = 'variant-id'; 
    const ATTR_SWIPER_FLAG = 'swiper-required';

    customElements.define('product-popup-gallery', class extends Core {

        elements = {
            variantSelect: '[data-variant-select]',
            swiper: '[data-swiper]',
            toCartButton: 'product-to-cart'
        }
        
        render() {
            this._initSwiper();
            this._handleVariantChange();
        }

        _initSwiper() {
            if (this.swiperRequired) {
                this.swiper = new Swiper(this.$swiper, { allowTouchMove: false });
            }
        }

        _handleVariantChange() {
            this.swiper && this.$variantSelect?.addEventListener(
                'change', 
                this._onOptionChange.bind(this)
            )
        }

        _onOptionChange({ target }) {
            this.variantId = target.value;
            this.$toCartButton.variantId = this.variantId;
            this._slideImage() 
        }

        _slideImage() {
            this.targetSlideId !== -1 && this.swiper?.slideTo(this.targetSlideId);
        }

        get swiperRequired() {
            return this.hasAttribute(ATTR_SWIPER_FLAG);
        }

        get targetSlideId() {
            return this.swiper.slides.findIndex(slide => slide.dataset.variantId === this.variantId)
        }

        get initialVariantId() {
            return this.getAttribute(ATTR_INITIAL_VARIANT_ID);
        }
    })
})();