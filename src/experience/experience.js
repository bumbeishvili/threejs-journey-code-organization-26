import * as THREE from 'three';
import Sizes from "./utils/sizes";
import Time from "./utils/time";
import Camera from "./camera";
import Renderer from "./renderer";
import World from "./world/world";
import Resources from "./utils/resources";
import sources from "./sources";
import Debug from './Utils/Debug.js'

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
        this.debug = new Debug();
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
        console.log('SIZ - experience resize', this.sizes)
        this.camera.resize();
        this.renderer.resize();
    }

    update() {
        this.world.update();
        this.camera.update();
        this.renderer.update();
        // console.log('experience update', this.time)
    }

    destroy() {
        this.sizes.off('resize');
        this.time.off('tick');

        this.scene.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                for (const key in child.material) {
                    const val = child.material[key];
                    if (val && typeof val.dispose === 'function') {
                        val.dispose();
                    }
                }
                child.material.dispose();
            }
        })

        this.camera.controls.dispose();
        this.renderer.instance.dispose();

        if(this.debug.active){
            this.debug.ui.destroy();
        }
    }
}

