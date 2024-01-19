(async () => {
    const { Core } = await importModule('Core');
    const { fetchHTML, $replaceContent } = await importModule('Utils');

    customElements.define('collection-provider', class extends Core {

        elements = {
            form: '[data-collection-form]',
            drawerForm: '[data-collection-drawer-form]',
            dynamicBlocks: '*[data-collection-dynamic-block]'
        }

        subscriptions = {
            'filter:change': '_onFilterChange',
            'navigation:change': '_onFilterChange'
        }

        cache = {};

        render() {
            this.subscribe('filter:change');
            this.subscribe('navigation:change');
        }
        
        async _onFilterChange(data) {
            this._getUrlParams(data);
            this._updateHistory();
            this._scrollToTop();
            await this._updateDynamicBlocks();
        }

        _getUrlParams(data) {
            this.urlParams = data?.url
                ? new URL(`${window.location.origin}${data.url}`).searchParams
                : new URLSearchParams(new FormData(this.$currentForm));
        }

        _updateHistory() {
            window.history.pushState({}, null, `${window.location.pathname}?${this.urlParams.toString()}`);
        }

        async _updateDynamicBlocks() {
            await this._getDoc();
            this.$dynamicBlocks.map($block => {
                $replaceContent(
                    $block,
                    this.doc.getElementById($block.id)
                );
            });
            
        }

        async _getDoc() {
            const urlParamsStr = this.urlParams.toString();
            if(this.cache[urlParamsStr]) {
                this.doc = this.cache[urlParamsStr];
            } else {
                this.publish('collection:loading');
                await this._fetchDoc(urlParamsStr);
            }
            this.publish('collection:updated', {
                doc: this.doc
            })
        }

        async _fetchDoc(urlParamsStr) {
            const fetchParams = new URLSearchParams(urlParamsStr);
            fetchParams.append('section_id', this.sectionId);
            this.doc = await fetchHTML(`${this.getAttribute('collection-url')}?${fetchParams.toString()}`);
            this.cache[urlParamsStr] = this.doc;
        }

        _scrollToTop() {
            window.scrollTo({
                top: this.topPoint,
                behavior: 'smooth',
            });
        }

        get topPoint() {
            const headerHeight = document.documentElement.style.getPropertyValue('--header-height')?.replace('px', '');
            return headerHeight ? this.offsetTop - headerHeight : this.offsetTop;
        }

        get $currentForm() {
            if(!this.$form) {
                return this.$drawerForm;
            }
            return this.onMobile ? this.$drawerForm : this.$form;
        }

        get onMobile() {
            return window.matchMedia('(max-width: 992px)').matches;
        }
    })
})();