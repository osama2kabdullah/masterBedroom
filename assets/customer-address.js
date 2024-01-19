(async () => {
    const { Core } = await importModule('Core');

    customElements.define('customer-address-province-selector', class extends Core {
        elements = {
            select: 'select'
        }

        get hidden() {
            return this.hasAttribute('hidden');
        }

        get default() {
            return this.getAttribute('default');
        }
          
        set hidden(isHidden) {
            isHidden 
                ? this.setAttribute('hidden', '') 
                : this.removeAttribute('hidden');
        }

        update({ provinces }) {
            if(!provinces.length) {
                if(!this.hidden) {
                    this.$select.replaceChildren();
                    this.hidden = true;
                }
                return;
            }
            this._setOptions(provinces);
        }
        
        _setOptions(data) {
            const options = data.map(this._createOption.bind(this));
            this.$select.replaceChildren(...options);
            this.hidden = false;
        }

        _createOption([ value, text ]) {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = text;
            if(this.default === value) {
                option.selected = true;
            }
            return option;
        }
    })

    customElements.define('customer-address-country-selector', class extends Core {
        elements = {
            options: '*option'
        }

        get default() {
            return this.getAttribute('default');
        }

        async render() {
            await this._initProvinceSelector();
            this._getDefaultOption();            
            this.addEventListener('change', this._changeHandler)
        }
        
        async _initProvinceSelector() {
            await customElements.whenDefined('customer-address-province-selector');
            this.$provinceSelector = document.querySelector(`customer-address-province-selector[form-id="${ this.getAttribute('form-id') }"]`);
        }

        _getDefaultOption() {
            const initialOption = 
                this.default
                ? this.$options.find(({ value }) => value === this.default)
                : this.$options.find(({ selected }) => selected);

            initialOption.selected = 'selected';
            this._updateProvinceSelector({
                value: initialOption.value,
                provinces: initialOption.dataset.provinces
            });
        }

        _updateProvinceSelector({ value, provinces }) {
            this.$provinceSelector.update({
                value,
                provinces: JSON.parse(provinces)
            })
        }
        
        _changeHandler(e) {
            this._updateProvinceSelector({
                value: e.target.value,
                provinces: e.target.options[e.target.selectedIndex].dataset.provinces
            })
        }
    })
})();


