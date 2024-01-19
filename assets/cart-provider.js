(async () => {
    const { Core } = await importModule('Core');
    const { Routes, parseHTML } = await importModule('Utils');
    
    const CART_R_SECTION = 'r_cart';
    const NOTIFICATION_SECTION = 'r_cart-notification';
    const ATTR_IS_CART_PAGE = 'cart-page';
    const SECTION_DRAWER = 'g_cart-drawer';

    customElements.define('cart-provider', class extends Core {
        subscriptions = {
            'cart:add-feature': '_addFeature',
            'cart:add': '_add',
            'cart:change': '_update'
        }

        features = {};

        render() {
            this.subscribe('cart:add-feature', { global: true });
            this.subscribe('cart:add', { global: true });
            this.subscribe('cart:change', { global: true });
        }

        _addFeature({ feature }) {
            this.features[feature] = true;
        }
        
        async _add({ items }) {
            try {
                const resBody = {items};
                if (this.features['notification']) {
                    resBody.sections = [NOTIFICATION_SECTION];
                    resBody.attributes = {
                        notification_items_variant_ids: items.map(({id}) => id).join(',')
                    };
                }
                const res = await this._requestCart('cartAdd', resBody);

                this._cleanCartAttributes();
                
                if (this.redirectToCart) {
                    window.location.pathname = Routes('cart');
                    return;
                }

                const cartData = await res.json();
                if(!res.ok) {
                    throw new Error(JSON.stringify({ message: cartData.message, description: cartData.description }))
                } else {
                    this._publishUpdates(cartData);
                }
            } catch (e) {
                console.error(e);
                const { message = '', description = '' } = JSON.parse(e.message);
                if (message || description)  {
                    this.publish(
                        'toast-notification:open', 
                        {   
                            title: message, 
                            message: description, 
                            type: 'error' 
                        }
                    )
                }
                this.publish('cart:error');
            }  
        }

        _cleanCartAttributes() {
            if(this.features['notification']) {
                this._requestCart('cartUpdate', { attributes: { notification_items_variant_ids: null }});
            }
        }

        async _update({ key, quantity, selling_plan }) {
            const res = await this._requestCart('cartChange', {
                    id: key, quantity, selling_plan,
                    sections: [CART_R_SECTION],
                    sections_url: Routes('cart')
                }
            );

            const cartData = await res.json();
            this._publishUpdates(cartData);
        }

        async _publishUpdates(cartData) {
            const eventData = {};  

            if (this.features['cart-total'] || this.features['counter'] || this.features['drawer']) 
                eventData.meta = await this._getCartMeta();

            if (this.features['drawer'])
                eventData.drawer = { 
                    section: await this._getDrawerSection(),
                    open: !this.features['notification']
                }

            if (this.features['notification'])
                eventData.notification = { 
                    section: cartData.sections[NOTIFICATION_SECTION],
                    recommendationProductId: cartData.items[0]?.product_id 
                }
                
            if (this.features['cart']) {
                const $cartDoc = parseHTML(cartData.sections[CART_R_SECTION]);
                eventData.cart = { 
                    getCount: () => $cartDoc.querySelector('[data-cart-counter]').innerText,
                    getItems: () => $cartDoc.querySelector('[data-cart-items]'),
                    getSubtotalBlock: () => $cartDoc.querySelector('[data-cart-subtotal-block]'),
                    getFreeShippingBlock: () => $cartDoc.querySelector('[data-cart-free-shipping-block]')
                }
            }

            this.publish('cart:update', eventData)
        }
        
        async _getCartMeta() {
            const res = await fetch(`${Routes('cart')}?view=meta`);
            const { count, ...data } = await res.json();
            return { count: Number(count), ...data };
        }

        async _getDrawerSection() {
            const res = await fetch(`${Routes('root')}?section_id=${SECTION_DRAWER}`);
            return await res.text();
        }

        _requestCart(route, body) {
            return fetch(`${Routes(route)}.js`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(body)
            })
        }

        get isCartPage() {
            return this.hasAttribute(ATTR_IS_CART_PAGE)
        }

        get redirectToCart() {
            return !this.isCartPage && !this.features['notification'] && !this.features['drawer'];
        }
    });

})();