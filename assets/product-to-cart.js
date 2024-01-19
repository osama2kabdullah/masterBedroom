(async () => {
    const { Core } = await importModule('Core');

    const CN_LOADING = '!loading';
    const ATTR_VARIANT_ID = 'variant-id';
    const ATTR_BELONGS_FORM = 'form-child';
    
    customElements.define('product-to-cart', class extends Core {
        elements = {
            button: '[data-to-cart]'
        }
        
        subscriptions = {
            'cart:update':  '_cartUpdateHandler',
            'cart:error':  '_cartUpdateHandler'
        }

        render() {
            this.subscribe('cart:update', { global: true });
            this.subscribe('cart:error', { global: true });
            this._handleClick()
        }

        _handleClick() {
            this.addEventListener('click', this._onClick.bind(this))
        }

        _onClick() {
            this.loading = true;
            !this.belongsToForm && this.addToCart(this.cartItem);
        }
 
        addToCart(items) {
            this.publish('cart:add', {
                items
            });
        }

        _cartUpdateHandler() {
            setTimeout(() => {
                this.loading = false
            }, 1500)
        }

        get belongsToForm() {
            return this.hasAttribute(ATTR_BELONGS_FORM)
        }

        get cartItem() {
            return [{ 
                id: +this.getAttribute(ATTR_VARIANT_ID), 
                quantity: 1
            }]
        }
        
        set loading(state) {
            this.$button.classList.toggle(CN_LOADING, state);
        }

        get cartNotificationsEnabled() {
            return window.global.cartNotificationsEnabled;
        }

        set variantId(id) {
            this.setAttribute(ATTR_VARIANT_ID, id)
        }

    })
})();