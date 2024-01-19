(async () => {
    const { $show } = await importModule('Utils');
    const { Core } = await importModule('Core');

    customElements.define('collection-loader', class extends Core {
        elements = {
            select: 'x-select',
            input: '[data-sort-input]'
        };

        subscriptions = {
            'collection:loading': '_collectionLoadingHandler'
        };

        render() {
            this.subscribe('collection:loading')
        }

        _collectionLoadingHandler() {
            $show(this);
        }
        
    })
})();