(async () => {
    const { Core } = await importModule('Core');
    const { 
        parseHTML,
        $clone,
    } = await importModule('Utils');


    customElements.define('cart-notification', class extends Core {
        subscriptions = {
            'cart:update': '_update'
        }

        async render() {
            await customElements.whenDefined('cart-provider');
            this.publish('cart:add-feature', { feature: 'notification' });
            this.subscribe('cart:update', { global: true });            
        }

        async _update({ notification }) {
            if (!notification?.section) return;
            const $doc = parseHTML(notification.section);
            this.$container = $clone($doc.querySelector('[data-content]'));
            this._openModal();
        }

        _openModal() {
            this.publish('modal:open', {
                content: this.$container,
                position: 'top-center',
                animation: 'slideTop'
            })
        }
    })
})();