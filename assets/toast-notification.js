(async () => {
    const { Core } = await importModule('Core');
    const { $clone, $show } = await importModule('Utils');

    const SEL_MESSAGE = '[data-msg]';
    const SEL_TITLE = '[data-title]';
    const SEL_ROOT = '[data-root]'

    customElements.define('toast-notification', class extends Core {
        
        subscriptions = {
            'toast-notification:open':  '_notificationHandler'
        }

        elements = {
            template: '[data-template]',
        }

        render() {
            this.subscribe('toast-notification:open', { global: true });
        }

        async _notificationHandler(data) {
            this._initContainer()
            this._setContent(data);            
            this._openModal();
        }

        _initContainer() {
            this.$container = $clone(this.$template);
        }

        _setContent({ title, message, type }) {
            this._setType(type)
                ._setIcon()
                ._setTitle(title)
                ._setMessage(message);            
        }

        _setType(type) {
            this.type = type;
            this.$root.classList.add(`@type:${this.type}`);
            return this;
        }

        _setIcon() {
            const $icon = this.$container.querySelector(`[data-icon="${this.type}"]`);
            $show($icon);
            return this;
        }

        _setTitle(title) {
            if (title) {
                this.$title.textContent = title
            } else {
                this.$title.remove();
            }
            return this;
        }

        _setMessage(message) {
            if (message) {
                this.$message.textContent = message
            } else {
                this.$message.remove();
            }
            return this;
        }
        
        _openModal() {
            this.publish('modal:open', {
                content: this.$container,
                animation:"slideBottom",
                position:"bottom-center"
            });
        }

        get $message() {
            return this.$container.querySelector(SEL_MESSAGE);
        }
        
        get $title() {
            return this.$container.querySelector(SEL_TITLE);
        }

        get $root() {
            return this.$container.querySelector(SEL_ROOT);
        }
    })
})();