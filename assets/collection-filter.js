(async () => {
    const { Core } = await importModule('Core');

    customElements.define('collection-filter', class extends Core {
        render() {
            this.addEventListener('change', this._changeHandler.bind(this));
        }
        _changeHandler(e) {
            this.publish('filter:change');
        }        
    })
})();
