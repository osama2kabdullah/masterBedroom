(async () => {
    const { Core } = await importModule('Core');
    const { fetchHTML } = await importModule('Utils');

    customElements.define('search-secondary-items', class extends Core {
        async render() {
            const doc = await fetchHTML(`${this.getAttribute('query')}&section-id=${this.getAttribute('section-id')}`);
            this.reRender(doc, this.getAttribute('target'));
        } 
    })
})();
