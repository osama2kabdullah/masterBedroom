(async () => {
    const { Core } = await importModule('Core');

    const CN_ACTIVE = '!active';

    customElements.define('scroll-to-top-button', class extends Core {
        elements = {
            trigger: '[data-trigger]',
            button: '[data-button]'
        }

        render() {
            this._handleTrigger();
            this._handleClick();
        }

        _handleTrigger() {
            const observer = new IntersectionObserver((entries) => {
                this.active = !entries[0].isIntersecting;
            });
            observer.observe(this.$trigger);
        }

        _handleClick() {
            this.addEventListener('click', this._onClick.bind(this));
        }

        _onClick() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        set active(state) {
            this.$button.classList.toggle(CN_ACTIVE, state);
        }
    });
})(); 