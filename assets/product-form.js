(async () => {
    const { Core } = await importModule('Core');
    const PREFIX_BUY_WITH = 'buy_with_' 

    customElements.define('product-form', class extends Core {

        elements = {
            formTargeter: '[data-product-form-targeter]',
            toCartButton: 'product-to-cart'
        }

        render() {
            if (!this.$formTargeter) return; 
            this.$form = this.$formTargeter.form;
            this.$form?.addEventListener('submit', this._submitHandler.bind(this));
        }

        _submitHandler(e) {
            e.preventDefault();
            this.$toCartButton.addToCart(this.cartItems, this.mainVariantId);
        }

        _isVariantInput([ inputName, value ]) {
            if (inputName === 'selling_plan') this._setSellingPlan(value);
            return inputName.includes(PREFIX_BUY_WITH) || inputName === 'id';
        }
        
        _setSellingPlan(id) {
            this.sellingPlanId = id;
        }

        _setCartItem([ inputName, value ]) {
            if (inputName === 'id') this.mainVariantId = value;
            const sellingPlanId = this.sellingPlanId || '';
            return {
                id: value,
                quantity: this._getItemQty(inputName),
                selling_plan: inputName === 'id' ? sellingPlanId : '',
                properties: this._getProperties(inputName)
            }
        }

        _getItemQty(inputName) {
            return inputName === 'id' ? this.qty : 1;
        }
        _getProperties(inputName) {
            return inputName === 'id' ? this.properties : {};
        }

        get cartItems() {
            return Array.from(this.formData.entries())
                .filter(this._isVariantInput.bind(this))
                .map(this._setCartItem.bind(this))
        }

        get formData() {
            return new FormData(this.$form);
        }

        get qty() {
            return +this.formData.get('quantity') || 1;
        }
        get properties() {
            const propertyKeys = this.formData.getAll('customPropertyReference');
            return propertyKeys.filter(Boolean).reduce((acc, key) => {
                acc[key] = this.formData.get(`properties[${key}]`);
                return acc;
            }, {})
        }
    })
})();