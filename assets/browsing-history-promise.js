export const BrowsingHistoryPromise = (async () => {
    const { Core } = await importModule('Core');
    const { 
        fetchHTML,
        $clone,
        Routes
    } = await importModule('Utils');

    const LS_HISTORY = 'browsingHistory';
    const ROOT_PRODUCTS_URL = Routes('root') === '/' ? `${Routes('root')}products` : `${Routes('root')}/products`;

    const Base = class extends Core {
        $productCards = [];
        updatedHistory = [];

        async _getProductCardTemplates(rqSectionId, template, limit = this.history.length) {
            (await Promise.all(this.history.map(async productHandle => {
                const doc = await fetchHTML(`${ROOT_PRODUCTS_URL}/${productHandle}?section_id=${rqSectionId}`);
                const cardTemplate = doc.querySelector(template);
                return cardTemplate ? { template: $clone(cardTemplate), productHandle } : null; 
            }))).slice(0, limit).map((item) => {
                if (item) {
                    this.$productCards.push(item.template);
                    this.updatedHistory.push(item.productHandle);
                }
            });
        }

        _initContainer(template) {
            this.$container = $clone(template).firstElementChild;
        }

        _setContainerContent(wrapperSelector) {
            const $contentWrapper = wrapperSelector 
              ? this.$container.querySelector(wrapperSelector) 
              : this.$container;
            $contentWrapper.replaceChildren(...this.$productCards);
        }

        _showHistory(template) {
            this.replaceChild(this.$container, template);
        }

        _updateLocalHistory() {
            this.updatedHistory.length ?
            localStorage.setItem(LS_HISTORY, JSON.stringify(this.updatedHistory))
            : localStorage.removeItem(LS_HISTORY)
        }

        get history() {
            return JSON.parse(localStorage.getItem(LS_HISTORY));
        }
    }
    return Base;
})();
