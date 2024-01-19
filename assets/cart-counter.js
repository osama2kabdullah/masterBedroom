(async () => {
    const { Core } = await importModule('Core');
    const { $classListTemp, $toggleDisplay } = await importModule('Utils');

    const CN_ANIMATE = '!animate';

    customElements.define('cart-counter', class extends Core {

        subscriptions = {
            'cart:update': '_cartUpdateHandler'
        }

        async render() {
            await customElements.whenDefined('cart-provider');
            this.publish('cart:add-feature', { feature: 'counter' });
            this.subscribe('cart:update', { global: true });
        }

        _cartUpdateHandler({ meta }) {
            this.items = meta.count;
            $classListTemp(this, CN_ANIMATE);
        }

        set items(value) {
            this.textContent = value;
            $toggleDisplay(this, !!value);
        }
        
    })
})();