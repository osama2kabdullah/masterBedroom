(async () => {
    const { Core } = await importModule('Core');
    
    const SELECTOR_INPUT = 'input[name="selling_plan"]';

    customElements.define('selling-plan', class extends Core {

        render() {
            this._getSellingPlanInput();
            this._handleSubscriptions();
        }

        _getSellingPlanInput() {
            this.$sellingPlanInput = this.getParentSection().querySelector(SELECTOR_INPUT);
        }

        _handleSubscriptions() {
            if (this.$sellingPlanInput) {
                this.currentSellingPlanId = this.$sellingPlanInput.value;
                this._watchInput();
            }
        }

        _watchInput = function() {
            this._observeInputValueChange();
            this.$sellingPlanInput.addEventListener('change', this._handleSellingPlanChange.bind(this));
        }

        _observeInputValueChange = () => {
            this.observer = new MutationObserver(this._handleMutations.bind(this))
            this.observer.observe(this.$sellingPlanInput, { attributes: true, childList: false, subtree: false });
        }

        _handleMutations(mutationsList) {
            const valueChanged = mutationsList.find(mutation => mutation.type === 'attributes' && mutation.attributeName === 'value');
            if (valueChanged) this._handleSellingPlanChange(valueChanged);
        }

        async _handleSellingPlanChange({ target }) {
            const newSellingPlanId = target.value;
            if (newSellingPlanId === this.currentSellingPlanId) return;      
            this.currentSellingPlanId = newSellingPlanId;
            this.publish('selling-plan:change', {
                sellingPlanId: this.currentSellingPlanId
            });
        }

        disconnect() {
            this.observer?.disconnect();
        }
    })
})();