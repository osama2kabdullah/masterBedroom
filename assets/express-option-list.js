(async () => {
    const { Core } = await importModule('Core');
    
    customElements.define('express-option-list', class extends Core {

        elements = {
            toCartButton: 'product-to-cart',
            selectedVariantPrice: '[data-selected-variant-price]'
        }
        isSorted = false;
        render() {
            this.addEventListener('change', this._onSelect.bind(this))
        }

        _onSelect(e) {
            this.selectedVariantId = e.target.value;
            this.selectedVariantPrice = e.target.dataset.price;
            this.$toCartButton.variantId = this.selectedVariantId;
        }

        set selectedVariantPrice(value) {
            this.$selectedVariantPrice.innerText = value
        }
        
    })
})();