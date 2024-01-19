(async () => {
    const { Core } = await importModule('Core');
    const { $hover } = await importModule('Utils');

    customElements.define('main-navigation', class extends Core {
        elements = {
            dropdowns: '*[data-drop]'
        }
        render() {
            this.$dropdowns.map(this._handleDropdown.bind(this))
        }
        _handleDropdown(drop) {
            $hover(drop, (e, state) => this.publish('lights-out', state));
        }
    });
})();