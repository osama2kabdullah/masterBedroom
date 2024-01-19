(async () => {
    const { Core } = await importModule('Core');
    const { $toggleDisplay } = await importModule('Utils');

    customElements.define('buy-with-counter', class extends Core {
        elements = {
            addOne: '[data-element="add-one"]',
            addMany: '[data-element="add-many"]'
        }
        
        subscriptions = {
            'buyWith:change':  '_updateCounter'
        }

        render() {
            this.subscribe('buyWith:change');
        }
        
        _updateCounter({ selected }) {
            const count = selected + 1;
            this.$addMany.querySelector('[data-i18n-amount]').textContent = count;
            $toggleDisplay(this.$addMany, count > 1)
            $toggleDisplay(this.$addOne, count <= 1)

        }
    })
})();