(async () => {
    const { Core } = await importModule('Core');

    customElements.define('collection-nav-item', class extends Core {
        render() {
            this.addEventListener('click', this._handleClick.bind(this));
        }

        _handleClick(e) {
            e.preventDefault();
            this.publish('navigation:change', {
                url: this.getAttribute('to')
            })
        }
    })
})();
