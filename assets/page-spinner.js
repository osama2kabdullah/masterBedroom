(async () => {
    const { Core } = await importModule('Core');
    const { 
        $hide,
        $show 
    } = await importModule('Utils');

    customElements.define('page-spinner', class extends Core {

        subscriptions = {
            'spinner:show': '_onShow',
            'spinner:hide': '_onHide'
        }

        render() {
            this.subscribe('spinner:show', { global: true });
            this.subscribe('spinner:hide', { global: true });
        }
        
        _onShow() {
            $show(this);
        }

        _onHide() {
            $hide(this);
        }
    })
})();