import * as THREE from 'three';
import Experience from "../experience";

export default class Floor {
    constructor(experience) {
        console.log('INI - floor init', arguments)
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.setGeometry();
        this.setTextures();
        this.setMaterial();
        this.setMesh();
    }

    setGeometry() {
        this.geometry = new THREE.CircleGeometry(5, 64)
    }

    setTextures() {
        this.textures = {
            grass: this.resources.items.grassColorTexture,
            normal: this.resources.items.grassNormalTexture
        }

        this.textures.grass.encoding = THREE.sRGBEncoding;
        this.textures.grass.repeat.set(1.5, 1.5);
        this.textures.grass.wrapS = THREE.RepeatWrapping;
        this.textures.grass.wrapT = THREE.RepeatWrapping;


        this.textures.normal.repeat.set(1.5, 1.5);
        this.textures.normal.wrapS = THREE.RepeatWrapping;
        this.textures.normal.wrapT = THREE.RepeatWrapping;

    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures.grass,
            normalMap: this.textures.normal,
            roughness: 0.5,
            metalness: 0.5,
        });
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.receiveShadow = true
        this.scene.add(this.mesh);
    }
}