(async() => {
    const { Core } = await importModule('Core');

    customElements.define('main-navigation-mobile', class extends Core {
        elements = {
            stage: '[data-stage]',
            navItems: '*[data-to-lvl]'
        }

        render() {
            this._handleNavigation();
        }
        
        _handleNavigation() {
            this.$navItems.map(item => {
                item.addEventListener('click', e => {
                    this.$stage.dataset.current = item.dataset.toLvl;
                })
            })
        }
    });

})()