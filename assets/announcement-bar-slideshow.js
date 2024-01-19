(async () => {
    const { Core } = await importModule('Core');
    const { Swiper } = await importModule('Swiper');

    const NAV_ARROWS = 'arrows';
    const CN_AUTOPLAY = '@autoplay';
    const SP_AUTOPLAY = '--autoplay';
    const ATTR_AUTOPLAY = 'autoplay';
    
    customElements.define('announcement-bar-slideshow', class extends Core {
        elements = {
            swiper: '[data-swiper]',
            next: '[data-next]',
            prev: '[data-prev]'
        }

        render() {
            this._setSwiperProps();
            this._initSwiper();
            this._initAutoplay();
        }

        _setSwiperProps() {
            this.swiperProps = {
                loop: this.withLoop,
            };
            
            if(this.arrows)
                this.swiperProps.navigation = {
                    nextEl: this.$next,
                    prevEl: this.$prev
                }
            
            if(this.autoplay) 
                this.swiperProps.autoplay = {
                    delay: this.autoplay
                }
        }
 
        _initSwiper() {
            this.swiper = new Swiper(this.$swiper, this.swiperProps);
        }

        _initAutoplay() {
            if(this.autoplay) {
                this.classList.add(CN_AUTOPLAY);
                this.style.setProperty(SP_AUTOPLAY, `${this.autoplay}ms`);
                this.swiper.on('autoplayStop', () => {
                    this.classList.remove(CN_AUTOPLAY);
                });
            }
        }

        get arrows() {
            return this.hasAttribute(NAV_ARROWS);
        }
        get autoplay() {
            return this.getAttribute(ATTR_AUTOPLAY) && +this.getAttribute(ATTR_AUTOPLAY);
        }
        get withLoop() {
            return this.hasAttribute('loop');
        }
    })
})();