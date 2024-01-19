(async () => {
    const { Core } = await importModule('Core');
    const { computePosition, flip } = await importModule('FloatingUI');
    const { $show, $hide, $isHidden } = await importModule('Utils');
    const CLASSNAME_SELECTED = 'active';
    const CN_INIT = '!init';
    const SELECTOR_OPTION_CONTENT = '[data-option-content]';

    customElements.define('x-select', class extends Core {
        elements = {
            optionsList: '[data-options]',
            state: '[data-state]',
            options: '*[data-option]'         
        } 
        async render() {
            this.$currentOption = this.querySelector(`.${CLASSNAME_SELECTED}`) || '';
            this.$currentOption && this._setCurrent(this.$currentOption.dataset.option);
            
            computePosition(this.$state, this.$optionsList, {
                placement: 'bottom-end',
                strategy: 'absolute',
                middleware: [flip()],
            })
            .then(({ x, y }) => {
                Object.assign(this.$optionsList.style, {
                    left: `${x}px`,
                    top: `${y}px`
                })
                this._hideList();
                this.$optionsList.classList.remove(CN_INIT);
            })

            this.$state.addEventListener('click', () => { 
                this.isHidden ? this._showList() : this._hideList();
            });

            document.addEventListener('click', e => {
                if(this.$optionsList.contains(e.target) || this.contains(e.target)) {
                    return;
                }
                this._hideList();
            })
            this.$options.map(option => option.addEventListener('click', this._selectOption.bind(this)))
        }
        
        _selectOption({ currentTarget }) {
            this._hideList();
            if (currentTarget === this.$currentOption) return;
            this.$currentOption && this.$currentOption.classList.remove(CLASSNAME_SELECTED);
            this.$currentOption = currentTarget;
            this.$currentOption.classList.add(CLASSNAME_SELECTED);
            this._setCurrent(this.$currentOption.dataset.option);
            this.dispatchEvent(new CustomEvent('x-change', {
                detail: {
                    value: this.value
                }
            }));
        }
        
        _setCurrent(value) {
            this.value = value;
            this.$state.replaceChildren(...this.$currentOption.querySelector(SELECTOR_OPTION_CONTENT).cloneNode(true).childNodes);
        }

        _showList() {
            $show(this.$optionsList) 
        }

        _hideList() {
            $hide(this.$optionsList) ;
        }

        get isHidden() {
            return $isHidden(this.$optionsList)
        }
    })
})();