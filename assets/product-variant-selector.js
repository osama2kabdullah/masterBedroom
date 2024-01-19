(async() => {
    const { Core } = await importModule('Core');
    const {
        arrEq,
        $JSON,
        cache,
        fetchHTML
    } = await importModule('Utils');


    const CN_UNAVAILABLE = '!unavailable';
    const CN_SOLD_OUT = '!sold-out';
    const ATTR_OPTION_INDEX = 'data-option-index'; 
    const ATTR_VARIANT_ID = 'variant-id';
    const ATTR_SELLING_PLAN_ID = 'selling-plan-id';
    const ATTR_PRODUCT_URL = 'product-url';

    customElements.define('product-variant-selector', class extends Core {
        
        elements = {
            variantsJSON: '[data-variants-json]',
            optionsJSON: '[data-options-json]',
            inventoryJSON: '[data-inventory-json]',
            displayValues: '*[data-display-value]',
            selectors: '*[data-option-selector]',
            variantIdInput: 'input[name="id"]'
        }

        subscriptions = {
            'selling-plan:change': '_onSellingPlanChange',
            'cart:add': '_onCartAdd',
            'cart:change': '_onCartChange',
        }
        
        render() {
            this.options = $JSON(this.$optionsJSON);
            this.variants = $JSON(this.$variantsJSON);
            this.variantsInventory = $JSON(this.$inventoryJSON);
            
            this._handleCartQty();
            this._handleSellingPlanChange();
            this._getDefaultVariant();
            this._initCache();
            this._handleOptionChange();
            this.$variantIdInput.disabled = false;
        }
        
        _handleCartQty() {
            this.variants.map(variant => {
                if (this.variantsInventory[variant.id]) {
                    variant.available_to_add = +this.variantsInventory[variant.id].available_to_add;
                    variant.inventory_quantity = +this.variantsInventory[variant.id].inventory_quantity;
                }
            })
            this.subscribe('cart:add', {global: true});
            this.subscribe('cart:change', {global: true});
        }

        _onCartAdd({ items }) {
            items.map(addedItem => {
                const matchedVariant = this.variants.find(variant => variant.id === +addedItem.id);
                if (matchedVariant) {
                    matchedVariant.available_to_add -= +addedItem.quantity;
                    if (matchedVariant.id === this.variant.id && matchedVariant.available_to_add <= 0) {
                        this._updateCurrent();
                    }
                }
            })
        }

        async _onCartChange(item) {
            const matchedVariant = this.variants.find(variant => variant.id === +item.id);
            if (matchedVariant && matchedVariant.inventory_quantity) {
                const oldAvailableToAdd = matchedVariant.available_to_add
                const newAvailableToAdd = matchedVariant.inventory_quantity - +item.quantity;
                matchedVariant.available_to_add = newAvailableToAdd;
                if (matchedVariant.id === this.variant.id) {
                    if (oldAvailableToAdd <= 0 && newAvailableToAdd > 0 || newAvailableToAdd <= 0) {
                        this._updateCurrent();
                    }
                    return
                }
                this._clearVariantCache(matchedVariant.id, item.selling_plan)
            }
        }

        async _updateCurrent() {
            setTimeout(async () => {
                await this._fetchVariantDOM();
                this._publishChanges();
            }, 500)
        }

        _clearVariantCache(variantId, sellingPlanId) {
            cache.set(`${variantId}${sellingPlanId || ''}`, undefined);
        }

        _handleSellingPlanChange() {
            if (this.hasAttribute(ATTR_SELLING_PLAN_ID)) {
                this.sellingPlanId = this.getAttribute(ATTR_SELLING_PLAN_ID);
                this.subscribe('selling-plan:change');
            }
        }

        _handleOptionChange() {
            this._setOptionsAvailability();
            this.addEventListener('change', this._optionChangeHandler.bind(this));    
        }
        
        _getDefaultVariant() {
            this.variant = this.variants.find(({ id }) => id === +this.getAttribute(ATTR_VARIANT_ID));            
        }

        _initCache() {
            cache.set(`${this.variant.id}${this.sellingPlanId || ''}`, this.getParentSection()?.cloneNode(true));
        }

        _setOptionsAvailability() {
            this.options
                .reduce(this._getOptionsState.bind(this), [...new Set()])
                .map(this._toggleOptionAviability.bind(this))
        }

        _optionChangeHandler(e) {
            if(!(e instanceof CustomEvent)) {
                this._updateVariantWithOption(e.target);
                this._setOptionsAvailability();
                this._publishChanges();
                if (this.isProductPage) this._updateHistory();
            }
            this._updateDisplayValue(e.target);
            this.$variantIdInput.value = this.variant.id;
        }

        _onSellingPlanChange({ sellingPlanId }) {
            this.sellingPlanId = sellingPlanId;
            this._publishChanges();
            if (this.isProductPage) this._updateHistory();
        }

        _updateDisplayValue(target) {
            if(!this.$displayValues.length) return;
            const match = this.$displayValues.find(item => item.getAttribute(ATTR_OPTION_INDEX) === target.getAttribute(ATTR_OPTION_INDEX));
            if(match) match.innerText = target.value;
        }

        async _publishChanges() {
            this.publish('variant:change', {
                doc: cache.get(`${this.variant.id}${this.sellingPlanId || ''}`) || await this._fetchVariantDOM(),
                variantId: this.variant.id,
                stock: this.variant.available,
                variantImagePosition: this.variant.featured_media?.position,
                sellingPlanId: this.sellingPlanId
            });
        }

        _updateHistory() {
            window.history.replaceState({}, null, `${window.location.pathname}?${this.historyURLParams.toString()}`);
        }

        async _fetchVariantDOM() {
            this.publish('variant:loading', true);
            const doc = await fetchHTML(this.requestURL);
            this.publish('variant:loading', false);
            cache.set(`${this.variant.id}${this.sellingPlanId || ''}`, doc);
            return doc;
        }

        _updateVariantWithOption(target) {
            const index = +target.getAttribute(ATTR_OPTION_INDEX);
            this.variant = 
                this._getVariantFromValue(target.value, index) || 
                this._getFirstAvailableVariant(target.value, index);
        }

        _getVariantFromValue(setValue, i) {
            let newOptions = [...this.variant.options];
            newOptions[i] = setValue;
            return this.variants.find(({ options }) => arrEq(options, newOptions));
        }
        
        _getFirstAvailableVariant(value, index) {
            const match = this.variants.find(variant => variant.options[index] === value);
            this._selectVariantOptions(match, index);
            return match;
        }

        _selectVariantOptions(src, ignore) {
            src.options.map((value, i) => {
                if(i !== ignore) {
                    const input = this._getInputEl(value, i);
                    input.checked = true;
                    input.dispatchEvent(new CustomEvent('change', {
                        bubbles: true,
                        cancelable: true
                    }));
                }
            })
        }

        _getOptionsState(acc, option, i) {
            option.values.map(value => {
                const matchedVariant = this._getVariantFromValue(value, i);
                acc.push({
                    value,
                    index: i,
                    exists: !!matchedVariant,
                    available: matchedVariant?.available
                });
            })
            return acc;
        }

        _getInputEl(value, index) {
            return this.querySelector(`[value="${value.replace(/["\\]/g, '\\$&')}"][${ATTR_OPTION_INDEX}="${index}"]`)
        }

        _toggleOptionAviability({ value, index, exists, available }) {
            const $input = this._getInputEl(value, index);
            $input.classList.toggle(CN_UNAVAILABLE, !exists);
            $input.classList.toggle(CN_SOLD_OUT, exists && !available);
        }

        get requestURL() {
            const params = new URLSearchParams({ 
                'selling_plan': this.sellingPlanId, 
                'variant': this.variant.id,
                'section_id': this.sectionId
            });
            return `${this.productURL}?${params.toString()}`;
        }

        get productURL() {
            return this.getAttribute(ATTR_PRODUCT_URL);
        }

        get historyURLParams() {
            const params = new URLSearchParams({ 
                'variant': this.variant.id
            });
            this.sellingPlanId ? params.set('selling_plan', sellingPlanId) : params.delete('selling_plan');
            return new URLSearchParams(params);
        }

        get isProductPage() {
            return this.hasAttribute('product-page')
        }

    });
})()