(async () => {
    const { Core } = await importModule('Core');
    const { parseHTML, $clone } = await importModule('Utils');

    const CN_EMPTY = '!empty';
    const EL_DRAWER_TRIGGER = 'cart-drawer-trigger';

   function defineTrigger() {
        if(!customElements.get(EL_DRAWER_TRIGGER)) {
            customElements.define(EL_DRAWER_TRIGGER, class extends Core {
                render() {
                    this.addEventListener('click', this._onClick.bind(this))        
                }
        
                _onClick(e) {
                    e.preventDefault();
                    this.publish('modal:open', {
                        stash: 'cart-drawer',
                        animation: 'slideRight',
                        position: 'center-right',
                        height: '100%',
                        width: 'min(30rem, 95vw)',
                        transition: '300'
                    });
                }
            })
        }
    }

    function selectItemByKey(key, src) {
        return src.querySelector(`[data-item-key="${key}"]`);
    }

    customElements.define('cart-drawer', class extends Core {
        subscriptions = {
            'modal:open':  '_close',
            'cart:update': '_update',
            'drawer:item-loading': '_itemLoading'
        }

        elements = {
            productLoadingTemplate: '[data-product-loading-template]',
            dynamicParts: '*[data-dynamic]'
        }

        async render() {
            await customElements.whenDefined('cart-provider');
            defineTrigger();
            this.publish('cart:add-feature', { feature: 'drawer' });
            this._handleEvents();
        }

        _handleEvents() {
            this.subscribe('cart:update', { global: true });
            this.subscribe('drawer:item-loading');
        }

        _itemLoading({ key }) {
            this.locked = true;
            const $upadtingItem = selectItemByKey(key, this);
            $upadtingItem
                ?.append($clone(this.$productLoadingTemplate))
        }
        
        async _update({ drawer, meta }) {
            if (!drawer?.section) return; // sanity check from provider
            // Since drawer wrapped inside a template (as stash) we need to clone it
            this.$updatedDoc = parseHTML(drawer.section).querySelector('#cart-drawer-stash').content.cloneNode(true);
            this._updateDynamicParts();
            this._toggleEmpty(meta?.count);
            this.locked = false;
            if(drawer.open) {
                this._open();
            }
        }
        
        _updateDynamicParts() {
            const parts = Array.from(this.$updatedDoc.querySelectorAll(this.elements.dynamicParts));
            parts.map(part => {
                const match = this.$dynamicParts.find(item => item.dataset.dynamic === part.dataset.dynamic);
                match.replaceChildren(...part.childNodes);
            })
        }

        _toggleEmpty(count) {
            this.classList.toggle(CN_EMPTY, !count);
        }
        
        _open() {
            this.publish('modal:open', {
                stash: 'cart-drawer',
                animation: 'slideRight',
                position: 'center-right',
                height: '100%',
                width: 'min(30rem, 95vw)',
                transition: '300'
            });
        }

        set locked(state) {
            this.classList.toggle('!loading', state);
            window.modalLock = state;
        }
    })

    const ATTR_VARIANT_ID = 'variant-id';
    const ATTR_SELLING_PLAN_ID = 'selling-plan-id';
    const ATTR_ITEM_KEY = 'key';
    
    customElements.define('cart-drawer-qty-button', class extends Core {
        render() {
            this.addEventListener('click', this._handleClick.bind(this), { once: true });
        }

        _handleClick() {
            this.publish('cart:change', {
                id: this.variantId,
                key: this.key,
                quantity: this.value,
                selling_plan: this.sellingPlanId,
                src: 'drawer'
            });
            
            this.publish('drawer:item-loading', {
                key: this.key
            })
        }

        disconnect() {
            this.removeEventListener('click', this._handleClick.bind(this), false);
        }

        get variantId() {
            return this.getAttribute(ATTR_VARIANT_ID);
        }

        get sellingPlanId() {
            return this.getAttribute(ATTR_SELLING_PLAN_ID) || '';
        }

        get value() {
            return this.getAttribute('set-value');
        }

        get key() {
            return this.getAttribute(ATTR_ITEM_KEY);
        }
    });
})();