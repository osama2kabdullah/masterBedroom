(async () => {
    const { Core } = await importModule('Core');

    customElements.define('cart-total', class extends Core {
        subscriptions = {
            'cart:update': '_cartUpdateHandler'
        }

        async render() {
            await customElements.whenDefined('cart-provider');
            this.publish('cart:add-feature', { feature: 'cart-total' });
            this.subscribe('cart:update', { global: true });
        }

        _cartUpdateHandler({ meta }) {
            this.total = meta.total;
        }

        set total(value) {
            this.textContent = value;
        }
    });
})()