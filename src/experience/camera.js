import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Experience from "./experience"

export default class Camera {
    constructor() {
        console.log('INI - camera init', arguments)
        this.experience = new Experience(); // We get access to the first experience since we are using singleton pattern
        this.sizes = this.experience.sizes;
        this.time = this.experience.time;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.setInstance();
        this.setControls();
    }
    setInstance() {
        this.instance = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 1000);
        this.instance.position.set(6, 4, 8);
        this.scene.add(this.instance);
    }
    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;
    }

    resize() {
        console.log('SIZ - camera resize', this.sizes)
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }
    update(){
        this.controls.update();
    }
}