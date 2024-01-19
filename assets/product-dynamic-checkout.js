(async () => {
    const { Core } = await importModule('Core');
    const { $toggleDisplay } = await importModule('Utils');

    const CN_DISABLED = '!disabled';

    customElements.define('product-dynamic-checkout', class extends Core {
        subscriptions = {
            'buyWith:change':  '_handleBuyWith',
            'cart:add':  '_disable',
            'cart:update':  '_enable',
            'cart:error':  '_enable'
        }

        render() {
            this._rerenderPaymentButton();
            this.subscribe('buyWith:change');
            this.subscribe('cart:add', { global: true });
            this.subscribe('cart:update', { global: true });
            this.subscribe('cart:error', { global: true });
        }

        _rerenderPaymentButton() {
            if (window.Shopify?.PaymentButton?.init) {
              window.Shopify.PaymentButton.init();
            }
        };

        _handleBuyWith({ selected }) {
            return $toggleDisplay(this, !selected);
        }

        _disable() {
            this.disabled = true;
        }

        _enable() {
            setTimeout(() => {
                this.disabled = false
            }, 1500);
        };

        set disabled(state) {
            this.classList.toggle(CN_DISABLED, state);
        };
    })
})();