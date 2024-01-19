(async () => {
    const { Core } = await importModule('Core');
    const { fetchHTML, $replaceContent } = await importModule('Utils');

    customElements.define('search-secondary-results', class extends Core {
        elements = {
            template: 'template',
            content: '[data-content]'
        }

        async render() {
            const doc = await fetchHTML(`${this.getAttribute('query')}&section-id=${this.getAttribute('section-id')}`);
            const target = doc.getElementById(this.getAttribute('target'));
            if(target) {
                $replaceContent(this, this.$template);
                this.$content = this.querySelector(this.elements.content);
                $replaceContent(this.$content, target);
            }
        } 
    })
})();
