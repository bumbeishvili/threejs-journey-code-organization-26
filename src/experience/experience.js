import Sizes from "./utils/sizes";

export default class Experience {
    constructor(elem) {

        console.log('experience init', arguments)

        // Global Access
        window.experience = this;

        // Options
        this.canvas = elem;

        // Setup
        this.sizes = new Sizes();

        console.log(this.sizes)


    }
}