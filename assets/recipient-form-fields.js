(async () => {
    const { Core } = await importModule('Core');

    customElements.define('recipient-form-fields', class extends Core {
        elements = {
            fieldRefs: '*[data-field-ref]',
            fieldsTrigger: '[data-fields-trigger]'
        }

        render() {
            this.$fieldsTrigger.addEventListener('change', this._handleTriggerChange.bind(this));
        }

        _handleTriggerChange({ target }) {
            this._toggleFieldsDisable(!target.checked);
        }

        _toggleFieldsDisable(state) {
            this.$fieldRefs.map(field => field.disabled = state);
        }
    });
})();
