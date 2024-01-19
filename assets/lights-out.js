(async () => {

    const { Core } = await importModule('Core');

    customElements.define('lights-out', class extends Core {
        
        subscriptions = {
            'lights-out':  '_handleLights'
        }
        
        render() {
            this.subscribe('lights-out', { global: true });
        }

        _handleLights(state) {
            this.on = state
        }

        set on(state) {
            clearTimeout(this.timeout)
            if(state) {
                this.setAttribute('on', '');
                return;
            }
            this.timeout = setTimeout(() => this.removeAttribute('on'), 175);
        }
    });

})();