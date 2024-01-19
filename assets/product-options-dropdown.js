(async () => {

    const { Core } = await importModule('Core');

    customElements.define('product-options-dropdown', class extends Core {
        elements = {
            dropdown: 'drop-down',
            current: '[data-current]'
        }

        render() {
            this._handleChange();
        }

        _handleChange() {
            this.addEventListener('change', this._onChange.bind(this));
        }

        _onChange({ target }) {
            this.$current.textContent = target.value;
            this.$dropdown.close();
        }
    });

})();