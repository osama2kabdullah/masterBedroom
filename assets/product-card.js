
(async () => {
    const { Core } = await importModule('Core');

    customElements.define('product-card', class extends Core {
        elements = {
            swatches: '[data-element="swatches"]'
        }

        render() {
            this.$swatches?.addEventListener('mouseover', this._onMouseOver.bind(this))
            this.$swatches?.addEventListener('mouseout', this._onMouseOut.bind(this))

        }
        _onMouseOver({ srcElement }) {
            const swatchNumber = srcElement.dataset.swatchNumber;
            if (swatchNumber) {
                this.selectedSwatch = swatchNumber;
            }
        }
        _onMouseOut({toElement}) {
            if (toElement.dataset.element !== 'swatches') {
                this.selectedSwatch = null;
            }
        }

        set selectedSwatch(number) {
            this.dataset.selectedSwatch = number;
        }
    })
})();