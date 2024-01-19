(async () => {
    const { Core } = await importModule('Core');
    const { $hide, $show } = await importModule('Utils');

    const ATTR_ENABLE_SORT = 'enable-sort';
    const ATTR_ENABLE_STOCK_SORT = 'enable-stock-sort';
    const CN_ACTIVE = '!active';
    const CN_REVERSE = '!reverse';
    
    customElements.define('product-options-list', class extends Core {

        elements = {
            productJSON: '[data-product-json]',
            stockOnly: '[data-stock-only]',
            tableBody: '[data-table-body]',
            headers: '*[data-col-name]'
        }
        isSorted = false;
        render() {
            this.sortBy = '';
            this.isSortReversed = false;
            this.activeHeader;
            this.variants = JSON.parse(this.$productJSON.innerText);
            this.$rows = Array.from(this.$tableBody.rows);
            if(this.isSortingEnabled) {
                this.$headers.map(header => header.addEventListener('click', this._sortRows.bind(this)));
            }
            if (this.isStockSortingEnabled) {
                this.$stockOnly.addEventListener('change', this._toggleAvailable.bind(this));
            }
        }

        _sortRows({ currentTarget }) {
            if(currentTarget.dataset.colName === this.sortBy) {
                this.variants.reverse();
                this.isSortReversed = !this.isSortReversed;
            } else {
                this.sortBy = currentTarget.dataset.colName;
                this._sortVariants();
                this.isSortReversed = false;
            }
            this._toggleActiveHeader(currentTarget);
            this._renderSorted();
        }

        _toggleActiveHeader(currentHeader) {
            if (!!this.activeHeader) this.activeHeader.classList.remove(CN_ACTIVE, CN_REVERSE);
            this.activeHeader = currentHeader;
            this.activeHeader.classList.add(CN_ACTIVE);
            this.activeHeader.classList.toggle(CN_REVERSE, this.isSortReversed);
        }

        _sortVariants() {
            const compareProperties = (variantA, variantB) => {
                const propA = variantA[this.sortBy].toString();
                const propB = variantB[this.sortBy].toString();
                return propA.localeCompare(propB, undefined, { numeric: true })
            };
            this.variants.sort(compareProperties);
        }

        _renderSorted() {
            this.variants.map(variant => {
                const matchedItem = this.$rows.find(this._getRowByVariantId(variant));
                this.$tableBody.appendChild(matchedItem);
            })
            this.isSorted = true;
        }

        _getRowByVariantId(variant) {
            return (item) => +item.dataset['variantId'] === variant.id;
        }

        _toggleAvailable(e) {
            this.$rows.forEach(row => {
                if (row.dataset['variantAvailable'] === 'false') e.target.checked ? $hide(row) : $show(row);
            })
        }

        get isSortingEnabled() {
            return this.hasAttribute(ATTR_ENABLE_SORT);
        }

        get isStockSortingEnabled() {
            return this.hasAttribute(ATTR_ENABLE_STOCK_SORT);
        }
    })
})();