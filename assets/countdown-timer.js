(async () => {
    const { Core } = await importModule('Core');
    const { $hide, $show } = await importModule('Utils');

    const TICK = 1000;
    const _zeroPadding = (n) => {
        return (n < 10 ? "0" + n : n);
    }

    const _splitFloat = (f) => {
        const integer = Math.trunc(f);
        const remainder = f - integer
        return {integer, remainder};
    }

    customElements.define('countdown-timer', class extends Core {
        elements = {
            timer: '[data-elem="timer"]',
            days: '[data-element="days"]',
            hours: '[data-element="hours"]',
            minutes: '[data-element="minutes"]',
            seconds: '[data-element="seconds"]',
            completeMessage: '[data-element="complete-message"]'
        }

        render() {
            if (!this.settedDate) return;
            this._calcTimeLeft();
            if (!this.leftMs) return;
            this._initTimer();
            this._countdouwn();
            $show(this);
            // setTimeout(() => this._onComplete(), 5000) // For testing only
        }

        _calcTimeLeft() {
            const endDate = new Date(this.settedDate);
            const currentDate = new Date();
            this.leftMs = endDate.getTime() - currentDate.getTime();
        }

        _countdouwn() {
            this._tick();
            this.intervalID = setInterval(this._tick.bind(this), TICK);
        }

        _tick() {
            if (this.leftMs <= 0) {
                this._onComplete();
                return
            }
            const { update } = Object.entries(this.timer).reduce((acc, [name, props] ) => {
                const {integer, remainder} = _splitFloat(acc.left/props.baseMs);
                acc.left = remainder * props.baseMs;
                if(props.value !== integer) {
                    props.value = integer;
                    acc.update.push(name);
                }
                return acc;
            }, {left: this.leftMs, update: []});

            this._updateElements(update);
            this.leftMs -= TICK;
        }

        _onComplete() {
            clearInterval(this.intervalID);
            Object.values(this.timer).map(({ el }) => el.innerText = '00')
            this.$completeMessage && $show(this.$completeMessage);
            this.hideOnComplete && $hide(this.$timer);
        }

        _updateElements(update) {
            update.map((key) => {
                const { el, value } = this.timer[key]; 
                el.innerText = _zeroPadding(value);
            })
        }

        _initTimer() {
            this.timer = {
                days: {
                    value: 0,
                    baseMs: 86400000,
                    el: this.$days
                },
                hours: {
                    value: 0,
                    baseMs: 3600000,
                    el: this.$hours
                },
                minutes: {
                    value: 0,
                    baseMs: 60000,
                    el: this.$minutes
                },
                seconds: {
                    value: 0,
                    baseMs: 1000,
                    el: this.$seconds
                }
            };
        }

        get hideOnComplete() {
            return this.hasAttribute('hide-on-complete');
        }
        get settedDate() {
            return this.getAttribute('date');
        }
    })
})();