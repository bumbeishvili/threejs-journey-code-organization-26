import * as THREE from 'three';
import Experience from "../experience";
export default class Fox {
    constructor() {
        console.log('INI - fox init')
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;


        this.addModel();


    }

    addModel() {
        this.resource = this.resources.items.foxModel;
        this.foxModel = this.resource.scene;
        this.foxModel.scale.set(0.02, 0.02, 0.02)
        this.foxModel.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
            }
        })
        this.scene.add(this.foxModel);
    }
}