
(async () => {
    const { Core } = await importModule('Core');

    const CN_ACTIVE = '!active';

    customElements.define('tabs-nav' , class extends Core {
        
        elements = {
            navs: '*[data-tab-nav]'
        }

        render() {
            this.$activeNav = this.$navs[0];
            this.$navs.map(this._listenClick.bind(this))
        }

        _listenClick(nav){
            nav.addEventListener('click', () => this._setActive(nav));
        }

        _setActive(nav) {
            if (nav === this.$activeNav) return;
            if (window.innerWidth <= 992 ) {
                nav.scrollIntoView({ behavior: 'smooth', inline: "center", block: "nearest" });
            }
            this.$activeNav.classList.remove(CN_ACTIVE);
            this.$activeNav = nav;
            this.$activeNav.classList.add(CN_ACTIVE);
        }
    })
})();