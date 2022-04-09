import EventEmitter from "./event-emitter.js";
export default class Sizes extends EventEmitter {
    constructor() {
        super();
        console.log('INI - sizes init', arguments)
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        // RESIZe EVENTS
        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.pixelRatio = Math.min(window.devicePixelRatio, 2);
            this.trigger('resize');
        })
    }
}