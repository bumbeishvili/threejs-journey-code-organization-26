import * as dat from 'lil-gui'
export default class Debug {
    constructor() {
        console.log('INI - debug init')
        this.active = (window.location.hash === '#debug');
        if (this.active) {
            this.ui = new dat.GUI(); 
        }
    }
}  