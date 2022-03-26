import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import * as CANNON from 'cannon-es';

const hitSound = new Audio('/sounds/hit.mp3');

const playHitSound = (collision) => {
    const impactSpeed = collision.contact.getImpactVelocityAlongNormal();
    if(impactSpeed > 1.5) {
        hitSound.currentTime = 0;
        hitSound.play();
        hitSound.volume = Math.random();
    }
}



const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;

const defaultMaterial = new CANNON.Material('default');


const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.3,
        restitution: 0.7,
    }
);
//world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial;



// SPHERE
const sphereShape = new CANNON.Sphere(0.5);
const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: sphereShape,
    material: defaultMaterial
})
sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0));

world.addBody(sphereBody);

// PLANE
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body()
floorBody.material = defaultMaterial;
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);
floorBody.mass = 0;
floorBody.addShape(floorShape);
world.addBody(floorBody);

/**
 * Debug
 */
const gui = new dat.GUI()
const debugObj = {
    createSphere: () => {
        createSphere(0.5 * Math.random(), new THREE.Vector3(Math.random() * 0.1, 3, Math.random() * 0.1))
    },
    createBoxes: () => {
        createBoxes(Math.random() * 0.2,
            Math.random() * 0.2,
            Math.random() * 0.2,
            new THREE.Vector3(Math.random(), 3, Math.random())
        )
    },
    reset: () => {
        objsToUpdate.forEach(obj => {
            world.remove(obj.body)
            scene.remove(obj.mesh)
            //Remove event listener
            obj.body.removeEventListener('collide', playHitSound);            
        })
        
        objsToUpdate = []

        
        

        
        
    }
};
gui.add(debugObj, 'createSphere');
gui.add(debugObj, 'createBoxes');
gui.add(debugObj, 'reset');

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 32, 32),
//     new THREE.MeshStandardMaterial({
//         metalness: 0.3,
//         roughness: 0.4,
//         envMap: environmentMapTexture,
//         envMapIntensity: 0.5
//     })
// )
// sphere.castShadow = true
// sphere.position.y = 0.5
// scene.add(sphere)


/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 *  UTILS
 */

let objsToUpdate = [];
const material = new THREE.MeshStandardMaterial({
    color: 'white',
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
})

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

const createSphere = (radius, positions) => {
    const mesh = new THREE.Mesh(
        sphereGeometry,
        material
    )
    mesh.castShadow = true;
    mesh.position.copy(positions)
    mesh.scale.set(radius, radius, radius)
    scene.add(mesh)

    // Canon.js Body
    const shape = new CANNON.Sphere(radius);
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(positions.x, positions.y, positions.z),
        shape: shape,
        material: defaultMaterial
    })
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    objsToUpdate.push({
        mesh: mesh,
        body: body
    })
}



const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const createBoxes = (width, height, depth, positions) => {
    const mesh = new THREE.Mesh(
        boxGeometry,
        material
    )
    mesh.castShadow = true;
    mesh.position.copy(positions)
    mesh.scale.set(width, height, depth)
    scene.add(mesh)

    // Canon.js Body
    const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(positions.x, positions.y, positions.z),
        shape: shape,
        material: defaultMaterial
    })

    body.addEventListener('collide', playHitSound);
    body.sleepTimeLimit = 0.1;
    
    world.addBody(body)

    objsToUpdate.push({
        mesh: mesh,
        body: body
    })
}


for (let i = 0; i < 1; i++) {
    setTimeout(d => {
        createSphere(0.2, new THREE.Vector3(Math.random(), Math.random(), Math.random()))
    }, i * Math.random() * 100)

    setTimeout(d => {
        createBoxes(Math.random() * 0.4,
            Math.random() * 0.4,
            Math.random() * 0.4,
            new THREE.Vector3(Math.random(), Math.random(), Math.random())
        )
    }, i * Math.random() * 100)

}



/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0;


const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const delta = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;;

    // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);
    world.step(1 / 60, delta, 3)

    objsToUpdate.forEach(obj => {
        obj.mesh.position.copy(obj.body.position)
        obj.mesh.quaternion.copy(obj.body.quaternion)
    })

    // sphere.position.copy(sphereBody.position);

    // Update Physics World

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()