(async () => {
    const { Core } = await importModule('Core');
    const { Swiper } = await importModule('Swiper');
    const {
        $isEmpty,
        $fetch,
        $replaceContent,
        Routes
    } = await importModule('Utils');

    const RQ_SECTION = 'r_cart-notification-recommendations-swiper';
    const CN_SHOW = '!show';
    const BREAKPOINTS = {
        breakpoints: {
            1: {
                slidesPerView: 1.3
            },
            992: {
                slidesPerView: 2.3
            }
        }
    }

    customElements.define('cart-notification-recommendations', class extends Core {
        elements = {
            content: '[data-content]',
            spacer: '[data-spacer]',
            navPrev: '[data-nav-prev]',
            navNext: '[data-nav-next]'
        }

        async render() {
            const $doc = await $fetch(Routes('productRecommendations'), {
                params: {
                    product_id: this.productId,
                    limit: 20,
                    section_id: RQ_SECTION,
                    intent: 'related'
                },
                select: '[data-template]'
            });

            if($isEmpty($doc)) {
                this.remove();
                return;
            }

            $replaceContent(this.$content, $doc);
            const offset =  parseFloat(getComputedStyle(this.$spacer).paddingRight);
            const swiperProps = {
                spaceBetween: 10,
                slidesOffsetBefore: offset,
                slidesOffsetAfter: offset,
                navigation: {
                    nextEl: this.$navNext,
                    prevEl: this.$navPrev,
                    disabledClass: '!disabled'
                },
                on: {
                    afterInit: () => {
                        this.classList.add(CN_SHOW)
                    }
                }
            }
            Object.assign(swiperProps, this.slidesPerView ? {slidesPerView: this.slidesPerView} : BREAKPOINTS)

            const swiper = new Swiper(this.$content.querySelector('[data-swiper]'), swiperProps);
        }

        get productId() {
            return this.getAttribute('product-id');
        }
        get slidesPerView() {
            return +this.getAttribute('slides-per-view');
        }
    });
})();