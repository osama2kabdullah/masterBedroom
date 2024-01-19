(async () => {
    const { Core } = await importModule('Core');
    const { Plyr } = await importModule('Plyr');

    customElements.define('video-player', class extends Core {

        elements = {
            embeddedPlayer: '[data-player]',
            HTML5Player: 'video'
        }

        render() {
            this.player = new Plyr(this.$player, {
                ratio: '16:9'
            });
        }

        get $player() {
            return this.$embeddedPlayer || this.$HTML5Player
        }
    })
})();
