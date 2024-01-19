(async () => {
    const { Core } = await importModule('Core');
    const { Swiper } = await importModule('Swiper');

    customElements.define('slide-show', class extends Core {
        elements = {
            swiper: '[data-swiper]'
        }

        render() {
            this.swiper = new Swiper(this.$swiper, {
                slidesPerView: 4,
                spaceBetween: 20,
                slidesOffsetBefore: (window.innerWidth - 1400) / 2,
                slidesOffsetAfter: (window.innerWidth - 1400) / 2,
                loop: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                  }
            });
        }
    })
})();