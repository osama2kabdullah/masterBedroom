(async () => {
    const { Core } = await importModule('Core');
    const { Routes } = await importModule('Utils');

    customElements.define('contact-form-submiter', class extends Core {
        elements = {
            form: '[data-contact-form]',
            formTargeter: '[data-contact-form-targeter]',
            inputs: '*[data-input]'
        }

        render() {
            if (!this.$form) {                
                this.$form = this.$formTargeter.form;
            }
            this.$form.addEventListener('submit', this._handleSubmit.bind(this));
        }

        async _handleSubmit(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const { url } = await this._send(formData);
            url.includes('challenge') ? e.target.submit() : this._success();
        }
        
        async _send(formData) {
            try {
                return await fetch(Routes('contact'), { method: 'POST', body: formData });
            } catch ({ message }) {
                console.error(message);
            }
        }
        
        _success() {
            this._publishNotification();
            this._clearInputs()
        }

        _publishNotification() {
            this.publish('toast-notification:open', {  
                    title: this.succesTitle,
                    message: this.succesMsg, 
                    type: 'success' 
                }
            )
        }

        _clearInputs() {
            this.$inputs.map($input => $input.value = '')
        }

        get succesMsg() {
            return this.getAttribute('success-message') || '';
        }

        get succesTitle() {
            return this.getAttribute('success-title') || '';
        }
    })

})();
