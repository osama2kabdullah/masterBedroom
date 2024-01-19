(async () => {
    const { Core } = await importModule('Core');
    const { $replaceContent, $toggleDisplay } = await importModule('Utils');

    customElements.define('x-cart', class extends Core {
        elements = {
            itemsContainer: '[data-cart-items-container]',
            emptyMsg: '[data-cart-empty]',
            items: '[data-cart-items]',
            subtotalBlock: '[data-cart-subtotal-block]',
            freeShippingBlock: '[data-cart-free-shipping-block]'
        }
        
        subscriptions = {
            'cart:update': '_onUpdate',
        }

        async render() {
            await customElements.whenDefined('cart-provider');
            this.publish('cart:add-feature', { feature: 'cart' });
            this.subscribe('cart:update', { global: true });
        };

        _onUpdate({ cart }) {
            if (!cart) return;
            const hasCartItems = cart.getCount() > 0;
            this._toggleView(hasCartItems);
            hasCartItems && this._updateItems(cart);
        }

        _toggleView(state) {
            $toggleDisplay(this.$emptyMsg, !state)
            $toggleDisplay(this.$itemsContainer, state)
        }

        _updateItems({ getItems, getSubtotalBlock, getFreeShippingBlock }) {
            this.$subtotalBlock && $replaceContent(this.$subtotalBlock, getSubtotalBlock());
            this.$freeShippingBlock && $replaceContent(this.$freeShippingBlock, getFreeShippingBlock());
            $replaceContent(this.$items, getItems());
        }
    });
})();