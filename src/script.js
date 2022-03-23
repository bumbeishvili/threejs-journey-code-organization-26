import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}



/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test cube
 */

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight);




// Material
const textureLoader = new THREE.TextureLoader()

const gradientTexture = textureLoader.load('textures/gradients/5.jpg')
const material = new THREE.MeshToonMaterial({ color: parameters.materialColor })
material.gradientMap = gradientTexture;
gradientTexture.mipmap = false;
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;





// Meshes
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 100,),
    material
)

const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)

const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

const sectionMeshes = [mesh1, mesh2, mesh3]

const objDistance = 4;
mesh1.position.y = -objDistance * 0;
mesh2.position.y = -objDistance * 1;
mesh3.position.y = -objDistance * 2;

mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 2;

scene.add(mesh1, mesh2, mesh3)

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
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

let scrollY = window.scrollY;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    console.log({ scrollY })
})

const cursor = {
    x: 0,
    y: 0
};

window.addEventListener('mousemove', event => {
    cursor.x = event.clientX / sizes.width-0.5;
    cursor.y = -event.clientY / sizes.height+0.5;
    console.log(cursor)
})


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    sectionMeshes.forEach((mesh, index) => {
        mesh.rotation.y = elapsedTime * 0.1;
        mesh.rotation.x = elapsedTime * 0.12;
    })


    camera.position.y = -scrollY / sizes.height * objDistance;
    camera.position.x = cursor.x/4;
    

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        material.color.set(parameters.materialColor)
    })

