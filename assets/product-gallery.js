(async () => {
    const { Core } = await importModule('Core');
    const { Swiper } = await importModule('Swiper');

    const ATTR_INITIAL_POSITION = 'initial-image-position';

    customElements.define('product-gallery', class extends Core {
        elements = {
            swiper: '[data-swiper]',
            pagination: '[data-pagination]'
        }

        subscriptions = {
            'variant:change': '_onVariantChange'
        }

        render() {
            this._initSwiper();
            this.subscribe('variant:change');
        }

        _initSwiper() {
            this.swiper = new Swiper(this.$swiper, {
                autoHeight: true,
                pagination: {
                    el: this.$pagination,
                    type: 'bullets'
                },
                breakpoints: {
                    992: {
                        allowTouchMove: false
                    }
                }
            });
            if (this.initialPosition) {
                this.swiper.slideTo(+this.initialPosition - 1)
            }
        }

        _onVariantChange({ variantImagePosition}) {
            if(variantImagePosition) {
                this.swiper.slideTo(variantImagePosition - 1);
            }
        }

        get slider() {
            return this.swiper;
        }

        get initialPosition() {
            return this.getAttribute(ATTR_INITIAL_POSITION)
        }
    })
})();