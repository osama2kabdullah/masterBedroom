(async () => {
    const { Core } = await importModule('Core');
    const EL_PARENT = '[data-cart-item]';
    const CN_LOADING = '!loading';
    const ATTR_VARIANT_ID = 'variant-id';
    const ATTR_SELLING_PLAN_ID = 'selling-plan-id';
    const ATTR_LINE_KEY = 'line';
    const ATTR_ITEM_KEY = 'key';
    
    class CartControl extends Core {
        get variantId() {
            return this.getAttribute(ATTR_VARIANT_ID);
        }

        get sellingPlanId() {
            return this.getAttribute(ATTR_SELLING_PLAN_ID) || '';
        }
        
        get $parentItem() {
            return this.closest(EL_PARENT);
        }

        get line() {
            return this.getAttribute(ATTR_LINE_KEY)
        }

        get key() {
            return this.getAttribute(ATTR_ITEM_KEY);
        }

        parentLoading() {
            this.$parentItem?.classList.add(CN_LOADING);
        }
    }

    customElements.define('cart-qty-button', class extends CartControl { 
        render() {
            this.addEventListener('click', this._onQtyChange.bind(this), { once: true });
        };

        _onQtyChange(e) {
            e.preventDefault();
            this.parentLoading();
            this.publish('cart:change', {
                id: this.variantId,
                key: this.key, 
                quantity: this.value,
                selling_plan: this.sellingPlanId,
                line: this.line,
                src: this.tagName
            })
        };

        get value() {
            return this.getAttribute('set-value');
        }
    });

    customElements.define('cart-qty-input', class extends CartControl {
        render() {
            this.addEventListener('change', this._onQtyChange.bind(this), { once: true });
        };

        _onQtyChange(e) {
            this.parentLoading();
            this.publish('cart:change', {
                id: this.variantId,
                key: this.key, 
                quantity: e.target.value,
                selling_plan: this.sellingPlanId,
                line: this.line,
                src: this.tagName
            })
        };
    });
})();