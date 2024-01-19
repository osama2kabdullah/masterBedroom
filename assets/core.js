const BIND_EXCLUDED_METHODS = {
  constructor: true,
  render: true
}

class Core extends HTMLElement {
  static autobind = true;

  constructor() {
    super();
    this.sectionId = this.getAttribute('section-id');
    if (typeof this.onIntersect == 'function') {
      this.observer = new IntersectionObserver((entries) => {
        this.onIntersect(entries[0].isIntersecting);
      })
      this.observer.observe(this);
    }
    this._subs = {};

    // experimental
    // this._autobind();
  }
  // _autobind() {
  //   for(name of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
  //     if (typeof this[name] === 'function' && BIND_EXCLUDED_METHODS[name] !== true) {
  //       this[name] = this[name].bind(this);
  //     }
  //   }
  // }

  subscribe(eventName, options) {
    const handler = this.subscriptions[eventName];
    const handleFn = e => {
      if(options?.global || this.sectionId && this.sectionId === e.detail.sectionId) {
          const handler = this.subscriptions[eventName];
          this[handler](e.detail.data, e.detail.sectionId, e);
        }
    };

    this._subs[handler] = handleFn.bind(this);

    document.addEventListener(eventName, this._subs[handler], {
      once: !!options?.once,
      capture: true
    })

    // console.log(this._subs);

    // document.addEventListener(eventName, (e) => {
    //   if(options?.global || this.sectionId === e.detail.sectionId) {
    //     const handler = this.subscriptions[eventName];
    //     this[handler](e.detail.data, e.detail.sectionId, e);
    //   }
    // }, {
    //   once: !!options?.once,
    //   capture: true
    // });

    // const handler = this.subscriptions[eventName];

    // document.addEventListener(eventName, this[handler], {
    //   once: !!options?.once,
    //   capture: true
    // })
  }

  async publish(eventName, data) {
    const { publishEvent } = await importModule('Utils');
    publishEvent(eventName, data, this.sectionId)
    // const event = new CustomEvent(eventName, {
    // 	bubbles: false,
    //   cancelable: true,
    //   composed: true,
    // detail: {
    //   	sectionId: this.sectionId,
    //     data
    //   }
    // })
    // document.dispatchEvent(event);
  }

  getParentSection() {
    return document.getElementById(`shopify-section-${this.sectionId}`)
  }

  connectedCallback() {
    

    
    // if(this.subscriptions) {
    //   for (const [key, value] of Object.entries(this.subscriptions)) {
    //     if(typeof this[value] == 'function') {
    //       this[value] = this[value].bind(this);
    //     }
    //   } 
    // }
    if (this.elements) {
      for (const [key, value] of Object.entries(this.elements)) {
        this[`$${key}`] = value[0] === "*" 
          ? Array.from(this.querySelectorAll(value.substring(1)))
          : this.querySelector(value);
      }
    }

    if (typeof this.render == 'function') {
      this.render();
    }
  }

  disconnectedCallback() {
    if(typeof this.disconnect == 'function') {
      this.disconnect();
    }
    if (this.subscriptions) {
      for (const [key, value] of Object.entries(this.subscriptions)) {
        if(typeof this._subs[value] == 'function') {
          document.removeEventListener(key, this._subs[value], true); 
        }
      }
    }
   }

  reRender(doc, selector, root) {
    if(!selector) {
      selector = `${this.tagName}[section-id="${this.sectionId}"]`;
    }
    if(!root) {
      root = this;
    }
    const target = doc.querySelector(selector);
    root.replaceChildren(...target.cloneNode(true).childNodes);
  }

  $get(el, src = this) {
    return src.querySelector(this.elements[el]);
  }
}

export { Core, Core as default };