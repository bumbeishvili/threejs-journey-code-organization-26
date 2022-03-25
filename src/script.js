import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap';

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#aba9ff'
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

mesh1.position.x = 1.5
mesh2.position.x = -1.5
mesh3.position.x = 1.5;

scene.add(mesh1, mesh2, mesh3)

// Particles
const count = 200;
const positions = new Float32Array(count * 3);
const pointGeometry = new THREE.BufferGeometry();
const pointMaterial = new THREE.PointsMaterial({
    color: parameters.color,
    size: 0.01,
    sizeAttenuation: true
})

for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3 + 0] = (Math.random() - 0.5) * 4
    positions[i3 + 1] = -Math.random() * objDistance * 3 + 2
    positions[i3 + 2] = Math.random() * 4
}
pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const points = new THREE.Points(pointGeometry, pointMaterial);
scene.add(points)

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
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

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
let currentSection = 0;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    const newSection = scrollY / sizes.height;
    const newCurrentSection = Math.round(newSection)

    if (currentSection != newCurrentSection) {
        currentSection = newCurrentSection;
        gsap.to(sectionMeshes[currentSection].rotation, {
            duration: 1.5,
            ease: 'power2.inOut',
            x: '+=6',
            y: '+=3',
            z: '+=1.5'
        })

        console.log('section changed')
    }


})

const cursor = {
    x: 0,
    y: 0
};

window.addEventListener('mousemove', event => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = -event.clientY / sizes.height + 0.5;
})


/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    sectionMeshes.forEach((mesh, index) => {
        mesh.rotation.y += deltaTime * 0.1;
        mesh.rotation.x += deltaTime * 0.12;
    })


    camera.position.y = -scrollY / sizes.height * objDistance;
    // camera.position.x = cursor.x/4;

    const parallaxX = -cursor.x * 0.5;
    const parallaxY = -cursor.y * 0.5;
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime



    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        material.color.set(parameters.materialColor);
        pointMaterial.color.set(parameters.materialColor)
    })

