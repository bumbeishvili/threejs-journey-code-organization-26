import * as THREE from 'three';
import Experience from "../experience";

export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        // Setup
        this.setupLight()
        this.setupEnvironmentMap();
    }

    setupLight() {
        this.light = new THREE.DirectionalLight(0xffffff, 1);
        this.light.castShadow = true;
        this.light.shadow.mapSize.set(1024, 1024);
        this.light.shadow.camera.far = 15;
        this.light.shadow.normalBias = 0.05;  // To fix  smooth surface shading
        this.light.position.set(3, 3, -2.25);
        this.scene.add(this.light);
    }

    setupEnvironmentMap() {
        this.environmentMap = {};
        this.environmentMap.intensity = 0.4
        this.environmentMap.texture = this.resources.items.environmentMapTexture;  // File defined in sources.js
        this.environmentMap.texture.encoding = THREE.sRGBEncoding;

        // It works on top of the model, not in the background
        this.scene.environment = this.environmentMap.texture;

        // If we want env map background
        this.scene.background = this.environmentMap.texture;

        this.environmentMap.updateMaterial = (material) => {
            this.scene.traverse(child => {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                    child.material.envMap = this.environmentMap.texture;
                    child.material.envMapIntensity = this.environmentMap.intensity;
                    child.material.needsUpdate = true;
                }
            })
        }
        this.environmentMap.updateMaterial();
    }
}