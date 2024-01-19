(async () => {
    const { Core } = await importModule('Core');
    const { $fetch, debounce, $toggleDisplay, $replaceContent, scrollLock } = await importModule('Utils');
    
    const ATTR_ONLY_STOCK = 'only-stock-products';
    const ATTR_MIN_CHARS = 'min-chars';
    const ATTR_LIMIT = 'results-limit';
    const ATTR_WITH_SUGGESTIONS = 'with-suggestions';
    const ATTR_WITH_RECENT = 'with-recent';
    const ATTR_SOURCES = 'sources';
    const RQ_SECTION = 'r_predictive-search';
    const ATTR_NO_RESULTS = 'data-empty-results';
    const DEFAULT_MIN_CHARS = 3;
    const DEFAULT_LIMIT = 5;
    const CN_ACTIVE = '!active';
    const CN_LOADING = '!loading';

    customElements.define('predictive-search', class extends Core {
        elements = {
            form: 'form',
            input: 'input[name="q"]',
            button: '[data-element="button"]',
            results: '[data-results]',
            wrapper: '[data-wrapper]',
            initial: '[data-initial]',
            suggestions: '*[data-suggestion]'
        }

        subscriptions = {
            'recentSearches:select': '_updateInputValue'
        }

        cache = {};

        render() {
            // TEMP: dirty lights off fix
            this.addEventListener('click', (e) => {
                this.$input.focus();
            });

            this._disableAutocomplete();
            this._handleInput();
            this._handleButtonClick();
            this._handleOuterClick();
            this._handleSuggestions();
            this._handleRecentSearches();
        }

        _disableAutocomplete() {
            this.$input.setAttribute('autocomplete', 'off');
        }

        _handleInput() {
            this.$input.addEventListener('focus', this._handleFocus.bind(this));
            this.$input.addEventListener('blur', this._handleBlur.bind(this));
            this.$input.addEventListener('input',  debounce(this._inputHandler.bind(this), 300).bind(this));
        }

        _handleButtonClick() {
            this.$button.addEventListener('click', this._handleButtonOnEmpty.bind(this))
        }

        _handleButtonOnEmpty(e) {
            if (this.$input.value) return;
            e.preventDefault();
            this.$input.focus();    
        }

        _handleFocus() {
            this._handleActiveState();
            this.lights = false;   
        }

        _handleBlur(e) {
            this.lights = true;
        }

        _handleActiveState() {
            if(this.isEmptyResults) {
                this.showInitial = false;
                this.active = true;
            } else {
                this.showInitial = true;
                this.active = !!this.minQueryChars || !!this.$initial;
            }
        }

        async _inputHandler() {
            if(!this.minQueryChars) {
                this.showResults = false;
                this.isEmptyResults = false;
                this._handleActiveState();
                return;
            }
            this.loading = true;
            await this._getQueryResults();
            this._renderQueryResults();
        }

        async _getQueryResults() {
            if (!this.cache[`${this.query}`]) {
                const $resultsDoc = await this._fetchResultsDoc();
                const empty = $resultsDoc.hasAttribute(ATTR_NO_RESULTS);
                this.cache[`${this.query}`] = {
                    empty,
                    content: $resultsDoc
                };
            }
        }

        async _fetchResultsDoc() {
            return $fetch(`${routes.predictive_search_url}?${this.searchParams}`, { select: '[data-template]'});
        }

        _renderQueryResults() {
            $replaceContent(
                this.$results,
                this.cache[`${this.query}`].content
            )
            const isEmpty = this.cache[`${this.query}`].empty;
            this.isEmptyResults = !isEmpty;
            this._handleActiveState();
            this.loading = false;
            this.showResults = true;
        }

        _handleOuterClick() {
            document.addEventListener('click', (e) => {
                if(!this.contains(e.target) && this.active) {
                    this.active = false;
                }
            })
        }

        _handleSuggestions() {
            if(this.withSuggestions) {
                this.$suggestions.map($suggestion => {
                    $suggestion.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.$input.value = e.currentTarget.dataset.suggestion;
                        this.$input.focus();
                        
                        this.$input.dispatchEvent(new Event('input'));
                    })
                })
            }
        }

        _handleRecentSearches() {
            if (this.withRecent) {
                this.subscribe('recentSearches:select');
                this.addEventListener('click', (e) => {
                    if (e.target.href) this._publishQuery(this.query);
                }) 
                this.$form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const query = new FormData(this.$form).get('q');
                    this._publishQuery(query)
                    this.$form.submit();
                }, { once: true })
            };
        }

        _updateInputValue({value}) {
            this.$input.value = value;
            this.$input.focus();
        }

        _publishQuery(query) {
            this.publish('search:query', { query });
        }
        
        set loading(state) {
            this.classList.toggle(CN_LOADING, state);
        }

        set showInitial(state) {
            this.$initial && $toggleDisplay(this.$initial, state);
        }

        set showResults(state) {
            $toggleDisplay(this.$results, state);
        }

        set active(state) {
            this.$wrapper
                .classList
                .toggle(CN_ACTIVE, state);

            scrollLock(state);

            this._active = state;
        }

        get active() {
            return !!this._active;
        }

        get lights() {
            return this._lights;
        }

        set lights(state) {
            this.publish('lights-out', !state);
            this._lights = state;
        }

        get minQueryChars() {
            return this.query.length >= this.minChars;
        }

        get query() {
            return this.$input.value.trim();
        }

        get minChars() {
            return this.hasAttribute(ATTR_MIN_CHARS) 
                ? this.getAttribute(ATTR_MIN_CHARS) 
                : DEFAULT_MIN_CHARS;
        }

        get searchParams() {
            return new URLSearchParams({
                q: this.query,
                'resources[type]': this.sources,
                'resources[options][unavailable_products]': this.onlyStock,
                'resources[limit]': this.limit,
                'section_id': RQ_SECTION
            }).toString();
        }
        
        get sources() {
            return this.hasAttribute(ATTR_SOURCES) 
                ? this.getAttribute(ATTR_SOURCES).split(',').filter(Boolean).join(',')
                : '';
        }

        get onlyStock() {
            return this.hasAttribute(ATTR_ONLY_STOCK) 
                ? 'hide' 
                : 'last';
        }
        
        get limit() {
            return this.hasAttribute(ATTR_LIMIT) 
                ? this.getAttribute(ATTR_LIMIT)
                : DEFAULT_LIMIT;
        }

        get withSuggestions() {
            return this.hasAttribute(ATTR_WITH_SUGGESTIONS);
        }

        get withRecent() {
            return this.hasAttribute(ATTR_WITH_RECENT);
        }
    })
})();
