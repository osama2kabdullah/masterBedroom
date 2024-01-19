(async () => {
    const { Core } = await importModule('Core');

    customElements.define('collection-sort', class extends Core {
        render() {
            this._handleChange();
        }

        _handleChange() {
            this.addEventListener('change', this._onChange.bind(this));
        }

        _onChange() {
            this.publish('filter:change');
        }
    })
})();