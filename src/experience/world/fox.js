import * as THREE from 'three';
import Experience from "../experience";
export default class Fox {
    constructor() {
        console.log('INI - fox init', arguments)
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.debug = this.experience.debug;

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('fox');
            const debugObj = {
                playIdle: () => this.animation.play('idle'),
                playWalking: () => this.animation.play('walking'),
                playRunning: () => this.animation.play('running'),
            }
            this.debugFolder.add(debugObj, 'playIdle');
            this.debugFolder.add(debugObj, 'playWalking');
            this.debugFolder.add(debugObj, 'playRunning');
        }

        this.addModel();
        this.setAnimation();

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

    setAnimation() {
        this.animation = {};
        this.animation.mixer = new THREE.AnimationMixer(this.foxModel);


        this.animation.actions = {};
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0]);
        this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1]);
        this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2]);

        this.animation.actions.current = this.animation.actions.idle;
        this.animation.actions.current.play();

        this.animation.play = (name) => {
            const newAction = this.animation.actions[name];
            const oldAction = this.animation.actions.current;
            newAction.reset();
            newAction.play();
            newAction.crossFadeFrom(oldAction, 1);
            this.animation.actions.current = newAction;
        }
    }

    update() {
        this.animation.mixer.update(this.time.delta * 0.001);
    }
}