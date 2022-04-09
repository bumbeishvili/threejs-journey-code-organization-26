import * as THREE from 'three';
import Sizes from "./utils/sizes";
import Time from "./utils/time";
import Camera from "./camera";
import Renderer from "./renderer";
import World from "./world/world";
import Resources from "./utils/resources";
import sources from "./sources";

let instance = null;

export default class Experience {
    constructor(canvas) {
        if (instance) {
            return instance;
        }
        console.log('INI - experience init', arguments)
        instance = this;
        // Options
        this.canvas = canvas;



        // Global Access
        window.experience = this;



        // Setup
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.resources = new Resources(sources);
        this.camera = new Camera();
        this.renderer = new Renderer(this.canvas);
        this.world = new World();


        // Events
        this.sizes.on('resize', () => {
            this.resize();
        })

        this.time.on('tick', () => {
            this.update();
        })
    }

    resize() {
        console.log('experience resize', this.sizes)
        this.camera.resize();
        this.renderer.resize();
    }

    update() {
        this.camera.update();
        this.renderer.update();
        // console.log('experience update', this.time)
    }
}

