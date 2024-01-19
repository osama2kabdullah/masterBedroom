(async () => {
    const { Core } = await importModule('Core');

    customElements.define('product-variant-listener', class extends Core {

        subscriptions = {
            'variant:change': '_onVariantChange'
        }

        render() {
            // TEMP: emptyable -> bad naming
            this.emptyable = this.hasAttribute('emptyable');

            if(this.emptyable) {
                this.$meta = this.closest('[data-meta-block]');
                this._setMetaVisibility();
            }

            this.subscribe('variant:change');
        }
        
        _onVariantChange({ doc }) {
            this.reRender(doc, `[id="${this.id}"]`);

            if(this.emptyable) {
                this._setMetaVisibility();
            }
        }

        _setMetaVisibility() {
            this.$meta.toggleAttribute('hidden', this.textContent.trim() === '');
        }
    })
})();
