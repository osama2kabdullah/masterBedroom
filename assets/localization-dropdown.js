(async () => {
    const { Core } = await importModule('Core');
    const { $show } = await importModule('Utils');


    customElements.define('localization-dropdown', class extends Core {
        elements = {
            dropdown: 'drop-down',
            form: 'form',
            spinner: '[data-spinner]'
        }

        render() {
            this._handleFormChange();
            this._handleDropdownStateChange();
            
        }

        _handleDropdownStateChange() {
            if(this.lightsOut) {
                this.$dropdown.addEventListener('dropdown:open', this._onDropdownOpen.bind(this));
                this.$dropdown.addEventListener('dropdown:close', this._onDropdownClose.bind(this));
            }
        }

        _onDropdownOpen() {
            this.publish('lights-out', true);
        }

        _onDropdownClose() {
            this.publish('lights-out', false);
        }

        _handleFormChange() {
            this.$form.addEventListener('change', this._onFormChange.bind(this))
        }

        _onFormChange() {
            $show(this.$spinner);
            this.$form.submit();
        }

        get lightsOut() {
            return this.hasAttribute('lights-out');
        }
    });
})();