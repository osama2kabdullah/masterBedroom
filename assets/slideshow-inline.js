(async () => {
    const { Core } = await importModule('Core');
    const { Swiper } = await importModule('Swiper');

    customElements.define('slideshow-inline', class extends Core {
        defaultProps = {
            gap: window.gutterWidth,
            slidesPerView: 4
        }

        elements = {
            swiper: '[data-swiper]',
            pagination: '[data-pagination]',
            buttonPrev: '[data-button-prev]',
            buttonNext: '[data-button-next]'
        }

        render() {
            this._setSwiperProps();
            this._initSwiper();
            this._setSwiperPadding();
            this._setSwiperButtonsPosition();
        }
        
        _initSwiper() {
            this.swiper = new Swiper(this.$swiper, this.swiperProps);
        }

        _setSwiperProps() {
            this.swiperProps = {
                loop: this.withLoop,
                watchSlidesProgress: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                breakpoints: {
                    1: {
                        slidesPerView: 1.5,
                        spaceBetween: this.gap
                    },
                    992: {
                        slidesPerView: this.slidesPerView,
                        spaceBetween: this.gap
                    }
                }
            };
            if(this.withOffset) {
                this.swiperProps.slidesOffsetBefore = this.offset;
                this.swiperProps.slidesOffsetAfter = this.offset;
            }
            if(this.$pagination) {
                this.swiperProps.pagination = {
                    el: this.$pagination,
                    type: 'bullets',
                    clickable: true
                }
                if(this.withOffset) {
                    this.$pagination.style.setProperty('--offset', `${this.offset}px`);
                } else {
                    this.swiperPadding && this.$pagination.style.setProperty('--offset', `${this.swiperPadding}px`);
                }
            }
        }
        
        _setSwiperButtonsPosition() {
            this.swiperPadding && this.$swiper.style.setProperty('--button-position', (this.swiperPadding - this.navButtonWidth / 2) + 'px');
        }

        _setSwiperPadding() {
            if (this.swiperPadding) {
                this.$swiper.style.paddingLeft = this.swiperPadding + 'px';
                this.$swiper.style.paddingRight = this.swiperPadding + 'px';
            }
            return;
        }

        get slidesPerView() {
            return this.getAttribute('slides-per-view') 
                && +this.getAttribute('slides-per-view') 
                || this.defaultProps.slidesPerView;
        }
        get slidesCount() {
            return this.getAttribute('slides-count');
        }
        get gap() {
            return this.getAttribute('gap') 
                && +this.getAttribute('gap') 
                || this.defaultProps.gap;
        }
        get withOffset() {
            return this.hasAttribute('offset');
        }
        get withLoop() {
            return this.hasAttribute('loop') && this.slidesCount > this.slidesPerView;
        }
        get slidesCount() {
            return Number(this.getAttribute('slides-count') || this.querySelectorAll('.swiper-slide').length);
        }
        get offset() {
            return (document.documentElement.offsetWidth - window.containerInnerWidth) / 2;
        }

        get swiperPadding() {
            return this.hasAttribute('container') && (document.documentElement.offsetWidth - window.containerInnerWidth) / 2;
        }

        get navButtonWidth() {
            return this.$buttonNext.offsetWidth;
        }
    })
})();