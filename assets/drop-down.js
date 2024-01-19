(async () => {
    const { Core } = await importModule('Core');
    const { computePosition } = await importModule('FloatingUI');
    const { $show, $hide, $isHidden, $toggleDisplay } = await importModule('Utils');

    const CN_INIT = '!init';
    const CN_OPEN = '!open';
    const CN_SELECTED = '!selected';
    const ATTR_PLACEMENT = 'placement';

    customElements.define('drop-down', class extends Core {
        elements = {
            toggle: '[data-toggle]',
            toggleValue: '[data-toggle-value]',
            menu: '[data-menu]',
            options: '*[data-option-value]',
            select: '[data-select]'
        }

        render() {
            this._handleToggleClick();
            this._handleDocClick();
            this._handleOptions();
            this._handleSelectChange();
        }

        _handleSelectChange() {
            if(this.$select) {
                this.$select.addEventListener('change', this._onSelectChange.bind(this));
            }
        }

        _onSelectChange(e) {
            if(this.updateValue && this.$toggleValue) {
                this.$toggleValue.textContent = e.target.options[e.target.selectedIndex].text;
            }
            if(this.closeOnChange) {
                this.open = false;
            }

            this.$options.find(option => option.classList.contains(CN_SELECTED))?.classList.remove(CN_SELECTED);
            this.$options.find(option => option.dataset.optionValue === e.target.value)?.classList.add(CN_SELECTED);
        }

        _handleOptions() {
            if(this.$select) {
                this.$options.map($option => {
                    $option.addEventListener('click', (e) => {
                        if($option.dataset.optionValue !== this.$select.value) {
                            this.$select.value = $option.dataset.optionValue;
                            this.$select.dispatchEvent(new Event('change', {'bubbles': true}));
                        }
                    })
                });
            }
        }

        _initDropdown() {
            // It's hidden by default to avoid css lazy load collistions
            // We need to show it, so floating UI will able to calculate position
            $show(this.$menu);

            computePosition(this.$toggle, this.$menu, {
                placement: this.placement
            })
            .then(({ x, y }) => {
                Object.assign(this.$menu.style, {
                    left: `${x}px`,
                    top: `${y}px`
                })

                $hide(this.$menu);
                // CN_INIT keep element invisible while initilization.
                // Don't need it after the calculation
                this.classList.remove(CN_INIT);
            })
        }

        _handleDocClick() {
            document.addEventListener('click', this._onDocumentClick.bind(this));
        }

        _onDocumentClick(e) {
            if(!this.open || this.contains(e.target)) return;
            this.open = false;
        }

        _handleToggleClick() {
            this.$toggle.addEventListener('click', this._onToggleClick.bind(this));
        }

        _onToggleClick() {
            this.open = !this.open;
        }

        close() {
            this.open = false;
        }

        open() {
            this.open = true;
        }

        get placement() {
            return this.getAttribute(ATTR_PLACEMENT) || 'bottom';
        }

        get open() {
            return !$isHidden(this.$menu);
        }

        set open(state) {
            this.classList.toggle(CN_OPEN, state);
            $toggleDisplay(this.$menu, state);
            this.dispatchEvent(new CustomEvent(state ? 'dropdown:open' : 'dropdown:close'))
        }

        get updateValue() {
            return this.hasAttribute('update-value');
        }

        get closeOnChange() {
            return this.hasAttribute('close-on-change');
        }
    });
})();