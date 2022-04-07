export default class Sizes {
    constructor() {
        console.log('sizes init', arguments)
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRation = Math.min(window.devicePixelRatio, 2);

        // RESIZe EVENTS
        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.pixelRation = Math.min(window.devicePixelRatio, 2);
        })
    }
}