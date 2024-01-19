(async () => {
    const { Core } = await importModule('Core');
    const { parseHTML, Routes } = await importModule('Utils');
    
    const ATTR_LNG_SELECTOR = '[data-language-selector]';
    const CN_LOADING = '!loading';

    customElements.define('localization-form', class extends Core {

        elements = {
            countrySelector: '[data-country-selector]',
            languageSelector: '[data-language-selector]',
            form: '[data-localization-form]',
            button: '[data-button]'
        }
        
        render() {
            this._listenCountryChange()
        }

        _listenCountryChange() {
            this.$countrySelector.addEventListener('change', this._onCountryChange.bind(this))
        }
        
        async _onCountryChange() {
            this.loading = true;
            const doc = await this._getL10nDoc();
            this._updateLanguageOptions(doc)
            this.loading = false;
        }

        async _getL10nDoc() {
            return await fetch(Routes('localization'), { method: 'POST', body: new FormData(this.$form) }).then(res => res.text()).then(parseHTML);
        }

        _updateLanguageOptions(doc) {
            this.$languageSelector.replaceChildren(...doc.querySelector(ATTR_LNG_SELECTOR).cloneNode(true).childNodes);
        }

        set loading(state) {
            this.$button.classList.toggle(CN_LOADING, state);
        }
    })
})();