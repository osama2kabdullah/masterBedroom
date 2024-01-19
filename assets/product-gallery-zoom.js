(async () => {
    const { Core } = await importModule('Core');
    const { Drift } = await importModule('DriftZoom');
    const { $toggleDisplay } = await importModule('Utils');

    customElements.define('product-gallery-zoom', class extends Core {
        elements = {
            loading: '[data-loading]',
        }
        
        render() {
            this._initDrift();
        }

        _initDrift() {
            this.drift = new Drift(this, {
                paneContainer: this,
                inlinePane: false,
                zoomFactor: this.scale,
                onZoomLoad: () => this.loading = true,
                onZoomLoaded: () => this.loading = false,
            });
        }

        get scale() {
            return +this.getAttribute('scale');
        }

        set loading(state) {
            $toggleDisplay(this.$loading, state);
        }
    })
})()