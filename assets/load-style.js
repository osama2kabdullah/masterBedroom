(async () => {

    const { Core } = await importModule('Core');

    customElements.define('load-style', class extends Core {
        
        render() {
            if(window.globalLoadedStyles[this.src]) {
                return;
            }
            this._addStyleToDOM();
            this._registerStyle();
        }

        _addStyleToDOM() {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = this.src;
            link.media = 'all';
            document.head.appendChild(link);
        }

        _registerStyle() {
            window.globalLoadedStyles[this.src] = true;
        }

        get src() {
            return this.getAttribute('src');
        }
    });

})();