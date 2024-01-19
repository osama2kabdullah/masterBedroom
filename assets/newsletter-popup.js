(async () => {
    const { Core } = await importModule('Core');
    
    const addMSDays = (date, days) =>  {
        const ms = days * 86400000;
        return date + ms
    }
    
    const LS_LAST_VIEWED = 'newsletterLastViewed';
    const ATTR_DISPLAY_DELAY = 'display-delay';
    const ATTR_DAYS_TO_RE_APPEAR = 'days-to-re-appear';
    const ATTR_POPUP_POSITION = 'popup-position';
    const ATTR_UNLOCK_SCREEN = 'unlock-screen';
    const DEFAULT_POPUP_POSITION= 'center';

    customElements.define('newsletter-popup', class extends Core {  
        
        elements = {
            content:  '[data-content]'
        }

        async render() {
            await customElements.whenDefined('modal-popup');
            this._initPopup();
        };

        _initPopup() {
            if (this.lastViewed === null || Date.now() >= addMSDays(+this.lastViewed, this.daysToReAppear)) {
                this.lastViewed = Date.now();
                this._showPopup();
            }
        };
    
        _showPopup() {
            setTimeout(this._trigerModal.bind(this), this.displayDelay);
        };
    
        _trigerModal() {
            this.publish('modal:open', {
                target: '#newsletterPopup',
                backdrop: true,
                close: false,
                animation: 'fade',
                transition: 500,
                unlockScreen: this.unlockScreen,
                position: this.popupPosition
            });
        };

        set lastViewed(value) {
            window.localStorage.setItem(LS_LAST_VIEWED, value);
        }

        get displayDelay() {
            return this.getAttribute(ATTR_DISPLAY_DELAY)*1000;
        }

        get unlockScreen() {
            return this.hasAttribute(ATTR_UNLOCK_SCREEN);
        }

        get lastViewed() {
            return window.localStorage.getItem(LS_LAST_VIEWED);
        }

        get daysToReAppear() {
            return +this.getAttribute(ATTR_DAYS_TO_RE_APPEAR);
        }

        get popupPosition() {
            if (window.innerWidth <= 992) {
                return DEFAULT_POPUP_POSITION;
            }
            return this.getAttribute(ATTR_POPUP_POSITION);
        }
    });
})();