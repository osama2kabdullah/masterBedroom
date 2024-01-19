(async () => {
    const { Core } = await importModule('Core');

    const {
        $hide,
        $show
    } = await importModule('Utils');

    customElements.define('announcement-bar', class extends Core {
        elements = {
            closeButton:  '[data-close]'
        }

        render() {
            const isHidden = window.sessionStorage.getItem('hideAnnouncement');
            if (!isHidden) $show(this);            
            
            this.$closeButton?.addEventListener('click', () => {
                window.sessionStorage.setItem('hideAnnouncement', 'true');
                $hide(this);
            })
        }
    })
})();