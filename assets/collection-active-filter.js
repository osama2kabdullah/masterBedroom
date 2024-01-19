(async () => {
    const { Core } = await importModule('Core');

    customElements.define('collection-active-filter', class extends Core {
        render() {
            this.addEventListener('click', this._handleClick.bind(this));
        }

        _handleClick() {
            this.publish('filter:change', {
                url: this.getAttribute('remove-url')
            })
        }
    })
})();
