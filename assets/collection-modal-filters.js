(async () => {
    const { Core } = await importModule('Core');

    customElements.define('collection-modal-filters', class extends Core {

        subscriptions = {
            'collection:updated': '_onCollectionChange',
        }

        render() {
            this.subscribe('collection:updated');
        }
        _onCollectionChange({ doc }) {
            this.replaceChildren(...doc.querySelector(`${this.getAttribute('target')}`).content.querySelector(`${this.tagName}[section-id=${this.sectionId}]`).cloneNode(true).childNodes);
        }        
    })
})();
