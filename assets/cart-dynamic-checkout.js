(async () => {
    const { Core } = await importModule('Core');

    customElements.define('cart-dynamic-checkout', class extends Core {
        
        subscriptions = {
            'cart:update': '_onUpdate',
        }

        render() {
            this.subscribe('cart:update', { global: true });
        }

        _onUpdate() {
            this.removeChild(this.firstElementChild);
            if (window.Shopify?.DynamicCheckoutCart?.render) {
              window.Shopify.DynamicCheckoutCart.render(this);
            }
        };
    })
})();