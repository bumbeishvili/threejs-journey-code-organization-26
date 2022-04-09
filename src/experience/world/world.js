import * as THREE from 'three';
import Experience from "../experience";
import Environment from './environment';
import Floor from './floor';
import Fox from './fox';


export default class World {
    constructor() {
        console.log('INI - world init',arguments)
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;




        this.resources.on('ready', () => {
            console.log('RES - resources ready in the world')
            this.floor = new Floor();
            this.fox = new Fox()
            this.environment = new Environment();
        })
    }

    update() {
        if (this.fox) {
            this.fox.update();
        }
    }
}