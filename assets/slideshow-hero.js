(async () => {
    const { Core } = await importModule('Core');
    const { Swiper } = await importModule('Swiper');

    const NAV_ARROWS = 'arrows';
    const NAV_PAG = 'pagination';
    const CN_AUTOPLAY = '@autoplay';
    const SP_AUTOPLAY = '--autoplay';
    const ATTR_AUTOPLAY = 'autoplay';
    const CN_NAV_DISABLED = '!disabled';
    const SEL_BG_VIDEO = 'background-video';
    const SEL_VIDEO_SLIDE = '[data-video-slide]';
    const ATTR_HAS_VIDEO = 'has-video';
    const ATTR_NAVIGATION = 'navigation';
    const ATTR_AUTO_HEIGHT = 'auto-height';
    
    customElements.define('slideshow-hero', class extends Core {
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
        
        _initSwiper() {
            this.swiper = new Swiper(this.$swiper, this.swiperProps);
            this.hasVideo && this.swiper.on('slideChange', this._toggleVideo.bind(this));
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

        _setSwiperProps() {
            this.swiperProps = {
                loop: true
            };
            
            this.swiperProps.autoHeight = this.autoHeight;

            if(this.hasVideo) 
                this.swiperProps.on = {
                    init: () => {
                        window.customElements.whenDefined(SEL_BG_VIDEO).then(() => {
                            this.videoSlides = Array.from(this.querySelectorAll(SEL_VIDEO_SLIDE)).map(video => {
                                video.querySelector(SEL_BG_VIDEO).initPlayer();
                                return video;
                            })
                        })
                    }
                }

            if(this.navigation == NAV_ARROWS)
                this.swiperProps.navigation = {
                    nextEl: this.$next,
                    prevEl: this.$prev,
                    disabledClass: CN_NAV_DISABLED
                }

            if(this.navigation == NAV_PAG) 
                this.swiperProps.pagination = {
                    el: '.swiper-pagination',
                    type: 'bullets',
                    clickable: true
                }
            
            if(this.autoplay) 
                this.swiperProps.autoplay = {
                    delay: this.autoplay
                }
        }

        _toggleVideo({ slides, activeIndex, previousIndex }) {
            const current = this.videoSlides.find((item) => item === slides[activeIndex]);
            const prev = this.videoSlides.find((item) => item === slides[previousIndex]);
            current?.querySelector(SEL_BG_VIDEO)?.play();
            prev?.querySelector(SEL_BG_VIDEO)?.pause();            
        }

        get navigation() {
            return this.getAttribute(ATTR_NAVIGATION);
        }
        get hasVideo() {
            return this.hasAttribute(ATTR_HAS_VIDEO);
        }
        get autoplay() {
            return this.getAttribute(ATTR_AUTOPLAY) && +this.getAttribute(ATTR_AUTOPLAY);
        }
        get autoHeight() {
            return this.hasAttribute(ATTR_AUTO_HEIGHT);
        }
    })
})();