(async () => {
    const { Core } = await importModule('Core');
    const { $hide, $show } = await importModule('Utils');

    customElements.define('products-counter', class extends Core {
        
        subscriptions = {
            'buyWith:change':  '_updateCounter'
        }

        render() {
            this.subscribe('buyWith:change');
        }
        
        _updateCounter({ selected }) {
            const count = selected + 1;
            if (count > 1) {
                $show(this);
                this.textContent = count;
                return
            } 
            $hide(this); 
        }
    })
})();