(async () => {
    const { Core } = await importModule('Core');

    customElements.define('collection-filter-price', class extends Core {
        elements = {
            inputMin: '[data-element="input-min"]',
            inputMax: '[data-element="input-max"]'
        }

        render() {
            this._initSlider();
        }
        
        _initSlider() {
            this.$inputMin.addEventListener('change', this._sliderChangeHadler.bind(this));
            this.$inputMin.addEventListener('input', this._handleInput.bind(this));
            this.$inputMax.addEventListener('change', this._sliderChangeHadler.bind(this));
            this.$inputMax.addEventListener('input', this._handleInput.bind(this));
        }

        _sliderChangeHadler() {
            this.publish('filter:change');
        }

        _handleInput({ target }) {
            this._checkInputsIntersection(target);
            this._setRangeStyles();
        }
    
        _checkInputsIntersection(target) {
            if (target === this.$inputMin && this.minValue > this.maxValue) {
                this.$inputMin.value = this.maxValue;
            }
            if (target === this.$inputMax && this.maxValue < this.minValue) {
                this.$inputMax.value = this.minValue;
            }
        }

        _setRangeStyles() {
            const rangeMin = this.minValue / this.rangePercent;
            const rangeMax = this.maxValue / this.rangePercent;
            this.style.setProperty('--range-min', `${rangeMin}%`);
            this.style.setProperty('--range-max', `${rangeMax}%`);
        }

        get rangePercent() {
            return this.getAttribute('range-percent');
        }
        get minValue() {
            return this.$inputMin.valueAsNumber;
        }
        get maxValue() {
            return this.$inputMax.valueAsNumber;
        }
    })
})();
