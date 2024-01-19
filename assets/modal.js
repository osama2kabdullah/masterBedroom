(async () => {
    const { Core } = await importModule('Core');

    const {
        $replaceContent,
        $fetch,
        $toggleDisplay,
        scrollLock,
        $hide,
        $show
    } = await importModule('Utils');

    const CN_CONTAINER = '@container';

    const POSITION_MAP = {
        center: 'center',
        left: 'flex-start',
        right: 'flex-end',
        bottom: 'flex-end',
        top: 'flex-start'
    }

    customElements.define('modal-popup', class extends Core {
        elements = {
            dialog: '[data-dialog]',
            loading: '[data-loading]',
            content: '[data-content]',
            close: '[data-close]',
            stash: '[data-stash]'
        };

        subscriptions = {
            'modal:open':  'open',
            'modal:close': 'close',
            'modal:add-stash': '_addStash'
        };

        defaultProps = {
            animation: 'fade',
            transition: 500,
            height: 'auto',
            width: 'auto',
            maxWidth: '100%',
            maxHeight: '100%',
            position: 'center',
            closeButton: false
        };

        cache = {};
        stash = {};
        useCache = true;
        currentTarget;

        render() {
            this.subscribe('modal:open', { global: true });
            this.subscribe('modal:close', { global: true });
            this.subscribe('modal:add-stash', { global: true });
            this._closeOnBackdropClick();
        }

        async open({
            target,
            url,
            content,
            stash,
            container,
            unlockScreen = false,
            ...props
        }) {

            if(stash && !this.stash[stash]) {
                return;
            }
            this.backdropHidden = unlockScreen;
            
            if(this.$currentStash) {
                $hide(this.$currentStash);
                this.$currentStash = null;
            }
            if(this.$wrapper) {
                $hide(this.$wrapper);
            }
            

            this.$wrapper = stash ? this.$stash : this.$content;
            
            this._setProps(props);
            this._setStyleProps();
            this._setContainer(!!container);
            this._setCloseButton();

            scrollLock(!unlockScreen); 
            if(stash) {
                this._setStash(stash);
            } else {
                await this._setContent(target, url, content);
            }

            this._openModal();
        }

        close() {
            if (this.$dialog.open) {
                this.$dialog.setAttribute('closing', '');
                $hide(this.$close);
                
                this.$dialog.addEventListener('animationend', () => {
                    scrollLock(false);
                    if(this.$currentStash) {
                        $hide(this.$currentStash);
                        this.$currentStash = null;
                    }
                    $hide(this.$wrapper);
                    this.$dialog.removeAttribute('closing');
                    this.$dialog.removeAttribute('opening');
                    this.$dialog.close();
                    this._setContainer(false);
                    $hide(this.$close);
                }, { once: true });
            } 
        }

        _setCloseButton() {
            $toggleDisplay(this.$close, this.props.closeButton);
        }

        _openModal() {
            $show(this.$wrapper);
            if(!this.$dialog.open) {
                this.$dialog.showModal();
                this.$dialog.setAttribute('opening', '');
                // this.$dialog.addEventListener('animationend', () => {
                //     this.$dialog.removeAttribute('opening');
                // }, { once: true });
            }
        }

        _setContainer(state) {
            this.$content.classList.toggle(CN_CONTAINER, state);
        }

        _setProps(props) {
            this.props = Object.entries(this.defaultProps).reduce((acc, [key, val]) => {
                acc[key] = props[key] || val;
                return acc;
            }, {});
        }

        _setStyleProps() {
            const [y, x] = this.props.position.split('-');
            this.style.setProperty('--transition', this.props.transition + 'ms');
            this.style.setProperty('--animate-in', this.props.animation + 'In');
            this.style.setProperty('--animate-out', this.props.animation + 'Out');
            this.style.setProperty('--height', this.props.height);
            this.style.setProperty('--width', this.props.width);
            this.style.setProperty('--max-width', this.props.maxWidth);
            this.style.setProperty('--max-height', this.props.maxHeight);
            this.style.setProperty('--x', POSITION_MAP[x || y]);
            this.style.setProperty('--y', POSITION_MAP[y]);
        }

        _setStash(stashId) {
            this.$currentStash = this.stash[stashId];
            $show(this.$currentStash);
        }

        _addStash({id, target}) {
            if(this.stash[id]) {
                this.stash[id].replaceChildren(...document.querySelector(target).content.cloneNode(true).childNodes)
            } else {
                const stashItem = document.createElement('div');
                const stashContent = document.querySelector(target).content.cloneNode(true);
                stashItem.setAttribute('data-stash-id', id);
                stashItem.replaceChildren(...stashContent.childNodes);
                $hide(stashItem);
                this.$stash.appendChild(stashItem);
                this.stash[id] = stashItem;
            }
        }

        async _setContent(target, url, content) {
            if(content) {
                $replaceContent(this.$content, content);
                return;
            }
            const cacheId = (url || '') + target;
            const cached = this.cache[cacheId];

            const $content = cached && this.useCache 
                ? cached 
                : await this._getTargetContent(target, url);
            
            if(!$content) {
                console.error(`Modal ${cacheId} target element do not exists`);
                return;
            }

            if(this.useCache && !cached) {
                this._setCache(cacheId, $content);
            }
           
            $replaceContent(this.$content, $content);
        }

        async _getTargetContent(target, url) {
            if(!url) return document.querySelector(target);

            const $doc = await $fetch(url, {
                before: () => this._loading(true),
                after: () => this._loading(false),
                select: target
            });

            return $doc;
        }

        _setCache(id, $content) {
            this.cache[id] = $content;
        }
        
        _loading(state = true) {
            $toggleDisplay(this.$loading, state);
        }

        _closeOnBackdropClick() {
            this.$dialog.addEventListener('click', ({ target }) => {
                if((target === this.$dialog || target === this.$content) && !window.modalLock) {
                    this.close();
                }
            })
        }

        set backdropHidden(state) {
            this.toggleAttribute('unlock-screen', state)
        }

    });

    customElements.define('modal-trigger', class extends Core {
        render() {
            this.addEventListener('click', (e) => {
                e.preventDefault();
                this.publish('modal:open', {
                    target: this.getAttribute('target'),
                    animation: this.getAttribute('animation'),
                    transition: this.getAttribute('transition'),
                    url: this.getAttribute('url'),
                    position: this.getAttribute('position'),
                    height: this.getAttribute('height'),
                    width: this.getAttribute('width'),
                    maxWidth: this.getAttribute('max-width'),
                    maxHeight: this.getAttribute('max-height'),
                    container: this.hasAttribute('container'),
                    closeButton: this.hasAttribute('close-button'),
                    stash: this.getAttribute('stash')
                });
            })
        }
    })

    customElements.define('modal-close', class extends Core {
        render() {
            this.addEventListener('click', () => {
                this.publish('modal:close');
            })
        }
    });

    customElements.define('modal-load-stash', class extends Core {
        async render() {
            await customElements.whenDefined('modal-popup');
            this.publish('modal:add-stash', {
                id: this.stashId,
                target: this.target  
            });
        }

        get stashId() {
            return this.getAttribute('stash-id');
        }

        get target() {
            return this.getAttribute('target');
        }
    });
})();