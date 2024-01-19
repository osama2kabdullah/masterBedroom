(async() => {

    const { Core } = await importModule('Core');
    
    const CN_ACTIVE = '!active';

    customElements.define('product-info-loading', class extends Core {
        subscriptions = {
            'variant:loading': '_handleLoading'
        }
       
        render() {
            this.subscribe('variant:loading', { global: true });
        }
        
        _handleLoading(state) {
            this.classList.toggle(CN_ACTIVE, state);
        }
    });

})();