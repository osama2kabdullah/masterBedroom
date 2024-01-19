
(async () => {
    const { Core } = await importModule('Core');
    const { $toggleDisplay } = await importModule('Utils');

    const ATTR_MONEY_TEMPLATE = "money-template";
    const ATTR_MAIN_VARIANT_PRICE = "main-variant-price";
    const ATTR_SHOW_TOTAL = 'show-total';

    customElements.define('product-buy-with', class extends Core {
        elements = {
            items: '*[data-element="complementary-item"]',
            subtotal :'[data-element="subtotal"]',
            subtotalPrice :'[data-element="subtotal-price"]',
        }

        subscriptions = {
            'cart:update':  '_uncheck'
        }

        render() {
            this.subscribe('cart:update', { global: true });
            this._handleChange();
        }

        _handleChange() {
            this.addEventListener('change', this._onChange.bind(this));
        }

        _onChange() {      
            this._getCurrentItems();
            this.showTotal && this._updateSubtotal();
            this._publishChange();
        } 

        _getCurrentItems() {
            this.checkedItems = this.$items.filter(item => item.checked);
        }

        _uncheck() {
            this.checkedItems.map($checkbox => {
                $checkbox.checked = false;
            });
            $toggleDisplay(this.$subtotal, false);
            this._getCurrentItems();
            this._publishChange();
        }

        _publishChange() {
            this.publish('buyWith:change', { 
                selected: this.checkedItems.length
            })
        }

        _updateSubtotal() {
            this._getSubtotalWithCurrency();
            this.$subtotalPrice.innerText = this.subtotalWithCurrency;
            $toggleDisplay(this.$subtotal, !!this.checkedItems.length);
        }

        _getSubtotalWithCurrency() {
            this.subtotalWithCurrency = this.moneyTemplate.replace('{amount}', this.subtotalValue);
        }
    
        get subtotalValue() {
            return this.checkedItems
                    .map(item => +item.dataset.priceValue)
                    .reduce((acc, price) => acc += price, +this.mainVariantPrice)
                    .toLocaleString(undefined, {minimumFractionDigits: 2})
        }

        get mainVariantPrice() {
            return this.getAttribute(ATTR_MAIN_VARIANT_PRICE);
        }

        get moneyTemplate() {
            return this.getAttribute(ATTR_MONEY_TEMPLATE);
        }

        get showTotal() {
            return this.hasAttribute(ATTR_SHOW_TOTAL);
        }
    })
})();