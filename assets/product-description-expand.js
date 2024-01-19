(async () => {
    const { Core } = await importModule('Core');
    const { $show } = await importModule('Utils');

    const CN_EXPANDED = '!expanded';
    const EXPAND_THRESHOLD = 100;
    
    customElements.define('product-description-expand', class extends Core {
        elements = {
            content: '[data-content]',
            link: '[data-expand-link]'
        }


        render() {
            const contentHeight = this.$content.offsetHeight;
            if(contentHeight > EXPAND_THRESHOLD * 1.25) {
                this.classList.remove(CN_EXPANDED);
                this.style.setProperty('--expand-height', `${EXPAND_THRESHOLD}px`);
                $show(this.$link);
                this.$link.addEventListener('click', () => {
                    this.classList.toggle(CN_EXPANDED);
                })
            }
        }
    })
})();