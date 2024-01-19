(async () => {
    const { Core } = await importModule('Core');
    const { $clone } = await importModule('Utils');

    const SEL_INPUT = '[data-input]';

    customElements.define('product-qty-selector', class extends Core {
        elements = {
            selector: '[data-selector-wrapper]',
            inputTemplate: '[data-input-template]'
        }
        render() {
            this.$selector.addEventListener('change', this._onQtyChange.bind(this))
        }
        _onQtyChange(e) {
            if (+e.target.value === 10) this._changeInputType();
        }
        _changeInputType() {
            this.replaceChild($clone(this.$inputTemplate), this.$selector);
            this.querySelector(SEL_INPUT).setAttribute('value', 10);
        }        
    })
})();
