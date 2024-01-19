(async () => {
    const { Core } = await importModule('Core');

    const CN_ACTIVE = '!active';

    customElements.define('slideshow-thumbnails', class extends Core {
        elements = {
            items: '*[data-item]'
        }
        
        async render() {
            if(!this.$ref) return;

            await this._initRefSlider();
            this._handleItemsClick();
            this._handleSlideChange();
        }

        async _initRefSlider() {
            await customElements.whenDefined(this.$ref.localName);
            this._updateActive();
        }

        _handleSlideChange() {
            this.$ref.slider.on(
                'slideChange', 
                this._updateActive.bind(this)
            );
        }

        _handleItemsClick() {
            this.$items.map(($item, index) => {
                $item.addEventListener(
                    'click', 
                    () => this.$ref.slider.slideTo(index)
                );
            })
        }

        _updateActive() {
            this.active = this.$ref.slider.activeIndex;
            this._scrollToActiveView();
        }

        _scrollToActiveView() {
            this.scroll(0, this.$activeItem.offsetTop - this.$activeItem.offsetHeight * 3);
        }

        get $ref() {
            return document.querySelector(this.getAttribute('ref'));
        }

        set active(index) {
            const $item = this.$items[index];
            if(this.$activeItem === $item) return;
            
            if(this.$activeItem) {
                this.$activeItem.classList.remove(CN_ACTIVE);
            }
            $item.classList.add(CN_ACTIVE);
            this.$activeItem = $item;
        }
    });
})();