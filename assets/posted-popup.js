(async () => {
    const { Core } = await importModule('Core');

    const ATTR_NEWSLETTER_MSG = 'newsletter-msg';
    const ATTR_CONTACT_MSG = 'contact-msg';

    customElements.define('posted-popup', class extends Core {

        elements = {
            template: '[data-template]'
        }

        async render() {
            await customElements.whenDefined('modal-popup');
            this._initPopup();
        }

        _initPopup() {
            if (window.location.search.includes('?customer_posted=true', 'customer_posted%3Dtrue')) {
                this._trigerModal(this.newsletterMsg);
            } 
            if (window.location.search.includes('?contact_posted=true', 'contact_posted%3Dtrue')) {
                this._trigerModal(this.contactMsg);
            } 
        }

        _trigerModal(msg) {
            this.publish('toast-notification:open', {  
                title: msg, 
                type: 'success' 
            })
        }

        get newsletterMsg() {
            return this.getAttribute(ATTR_NEWSLETTER_MSG);
        }
        get contactMsg() {
            return this.getAttribute(ATTR_CONTACT_MSG);
        }
    });
})();