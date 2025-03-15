import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Pane } from 'tweakpane';

//Basic Initializations...
const scene = new THREE.Scene();
const pane = new Pane();
const textureLoader = new THREE.TextureLoader();

//Geomeries & Meshes...
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

const sunTexture = textureLoader.load('textures/2k_sun.jpg')
const mercuryTexture = textureLoader.load('textures/2k_mercury.jpg')
const venusTexture = textureLoader.load('textures/2k_venus.jpg')
const earthTexture = textureLoader.load('textures/2k_earth.jpg')
const moonTexture = textureLoader.load('textures/2k_moon.jpg')
const marsTexture = textureLoader.load('textures/2k_mars.jpg')
const spaceHDRI = textureLoader.load('textures/2k_stars_milky_way.jpg')

const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture
})
const venusMaterial = new THREE.MeshStandardMaterial({
  map: venusTexture
})

const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture
})

const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture
})

const marsMaterial = new THREE.MeshStandardMaterial({
  map: marsTexture
})

const mercuryMaterial = new THREE.MeshStandardMaterial({
  map: mercuryTexture
})

const sun = new THREE.Mesh(
  sphereGeometry,
  sunMaterial
)

sun.scale.setScalar(5);
scene.add(sun);

const planets = [
  {
    name: 'Mercury',
    radius: .5,
    distance: 10,
    speed: 0.01,
    materail: mercuryMaterial,
    moons: [],
  },
  {
    name: 'Venus',
    radius: .8,
    distance: 15,
    speed: 0.007,
    materail: venusMaterial,
    moons: [],
  },
  {
    name: 'Earth',
    radius: 1,
    distance: 20,
    speed: 0.005,
    materail: earthMaterial,
    moons: [
      {
        name: 'Moon',
        radius: .3,
        distance: 3,
        speed: 0.015,
        materail: moonMaterial,
      },
    ],
  },
  {
    name: 'Mars',
    radius: .7,
    distance: 25,
    speed: 0.003,
    materail: marsMaterial,
    moons: [
      {
        name: 'Phobos',
        radius: .1,
        distance: 2,
        speed: 0.02,
      }, {
        name: 'Deimos',
        radius: .2,
        distance: 3,
        speed: 0.015,
        color: 0xffffff,
      }
    ],
  },
]

const createPlanet = (planet) => {
  const planetMesh = new THREE.Mesh(
    sphereGeometry,
    planet.materail
  )
  planetMesh.scale.setScalar(planet.radius)
  planetMesh.position.x = planet.distance
  return planetMesh
}

const createMoon = (moon) => {
  const moonMesh = new THREE.Mesh(
    sphereGeometry, moonMaterial
  )
  moonMesh.scale.setScalar(moon.radius)
  moonMesh.position.x = moon.distance
  return moonMesh
}
const planetMeshes = planets.map((planet) => {
  const planetMesh = createPlanet(planet)
  scene.add(planetMesh)

  planet.moons.forEach((moon) => {
    const moonMesh = createMoon(moon)
    planetMesh.add(moonMesh)
  })
  return planetMesh
})

//Camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  .1,
  400);

const ambientLight = new THREE.AmbientLight(
  0xffffff,
  .1
)

const pointLight = new THREE.PointLight(
  0xffffff,
  150
)

scene.add(pointLight, ambientLight)

//Ploting Renderer.
const canvas = document.querySelector('#bg');
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
const maxPixelRatio = Math.min(window.devicePixelRatio, 2);
renderer.setPixelRatio(maxPixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 5, 100);

//Controls Initialization...
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 200;
controls.minDistance = 20;

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
})

//Loop to Render each Frame..
const renderloop = () => {

  planetMeshes.forEach((planet, planetIndex) => {
    planet.rotation.y += planets[planetIndex].speed
    planet.position.x = Math.sin(planet.rotation.y) * planets[planetIndex].distance
    planet.position.z = Math.cos(planet.rotation.y) * planets[planetIndex].distance
    planet.children.forEach((moon, moonIndex) => {
      moon.rotation.y += planets[planetIndex].moons[moonIndex].spped;
      moon.position.x = Math.sin(moon.rotation.y) * planets[planetIndex].moons[moonIndex].distance
      moon.position.z = Math.cos(moon.rotation.y) * planets[planetIndex].moons[moonIndex].distance
    })
  })

  controls.update(); renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop()