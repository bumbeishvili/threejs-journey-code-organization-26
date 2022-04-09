import EventEmitter from "./event-emitter.js";

export default class Time extends EventEmitter {
    constructor() {
        super();
        console.log('INI - time init', arguments);
        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0;
        this.delta = 16;
        window.requestAnimationFrame(() => {
            console.log('TIC - time ticking started', this);
            this.tick();
        })
    }

    tick() {
        const currentTime = Date.now();
        this.delta = currentTime - this.current;
        this.current = currentTime;
        this.elapsed += this.delta;
        this.trigger('tick');
        window.requestAnimationFrame(() => {
            this.tick();
        })
    }
}