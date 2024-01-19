(async () => {
    const { Core } = await importModule('Core');
    const { Plyr } = await importModule('Plyr');

    customElements.define('background-video', class extends Core {

        elements = {
            embeddedPlayer: '[data-player]',
            HTML5Player: 'video'
        }
        
        render() {
            if (!this.manualInit) this.initPlayer();
        }

        initPlayer() {
            if (this.desktopOnly && document.documentElement.clientWidth <= 992) {
                this.remove();
                return;
            }
            this.player = new Plyr(this.$player, {
                muted: true,
                controls: false,
                clickToPlay: false,
                fullscreen: false
            });
            this.player.on('ended', () => {
                this.player.restart();
            })
            this.player.on('ready', () => {
                this.player.play();
                this.player.decreaseVolume(100);
            })
            this.intersectionObserver.observe(this);
        }

        _observer([ entry ]) {
            entry.isIntersecting ? this.player?.play() : this.player?.pause();
        }

        pause() {
            this.player.pause();
        }

        play() {
            this.player.play();
        }

        get intersectionObserver() {
            return new IntersectionObserver(this._observer.bind(this));
        }

        get manualInit() {
            return this.hasAttribute('manual-init');
        }

        get desktopOnly() {
            return this.hasAttribute('desktop-only');
        }

        get $player() {
            return this.$embeddedPlayer || this.$HTML5Player
        }
    })
})();