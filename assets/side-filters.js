(async () => {
    const { Core } = await importModule('Core');

    customElements.define('side-filters', class extends Core {

        subscriptions = {
            'collection:updated': '_onCollectionChange',
        }

        render() {
            this.subscribe('collection:updated');
        }
        _onCollectionChange({ doc }) {
            this.replaceChildren(...doc.querySelector(`#${this.getAttribute('target-id')}`).content.querySelector('side-filters').cloneNode(true).childNodes);
        }        
    })
})();
