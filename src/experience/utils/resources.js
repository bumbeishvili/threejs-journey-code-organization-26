import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import EventEmitter from "./event-emitter";
export default class Resources extends EventEmitter {
    constructor(sources) {
        super();
        console.log('INI - resources init', arguments)

        // Options
        this.sources = sources;

        // Setup
        this.items = {};
        this.toLoad = this.sources.length;
        this.loaded = 0;
        this.setLoaders();
        this.startLoading();
    }
    setLoaders() {
        this.loaders = {};
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.textureLoader = new THREE.TextureLoader();
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
    }

    startLoading() {
        this.sources.forEach(source => {
            switch (source.type) {
                case 'gltf': this.loadGLTF(source); break;
                case 'texture': this.loadTexture(source); break;
                case 'cubeTexture': this.loadCubeTexture(source); break;
            }
        })
    }

    loadGLTF(source) {
        this.loaders.gltfLoader.load(source.path, file => {
            this.sourceLoaded(source, file);
        })
    }

    loadTexture(source) {
        this.loaders.textureLoader.load(source.path, file => {
            this.sourceLoaded(source, file);
        })
    }

    loadCubeTexture(source) {
        this.loaders.cubeTextureLoader.load(source.path, file => {
            this.sourceLoaded(source, file);
        })
    }

    sourceLoaded(source, file) {
        this.items[source.name] = file;
        this.loaded++;
        if (this.loaded === this.toLoad) {
            this.trigger('ready')
            console.log('RES - resources ready', this.items)
        }
    }
}