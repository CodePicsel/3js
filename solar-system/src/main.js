import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Pane } from 'tweakpane';

//Basic Initializations...
const scene = new THREE.Scene();
const pane = new Pane();

//Geomeries & Meshes...
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
  color: 0xfff700
})

const sun = new THREE.Mesh(
  sphereGeometry,
  sunMaterial
)

sun.scale.setScalar(5);

scene.add(sun);

const earthMaterial = new THREE.MeshBasicMaterial({
  color: 'blue'
})

const earth = new THREE.Mesh(
  sphereGeometry,
  earthMaterial
)

earth.position.x = 10;
scene.add(earth);

const moonMaterial = new THREE.MeshBasicMaterial({
  color: 'grey'
})

const moon = new THREE.Mesh(
  sphereGeometry,
  moonMaterial
)

moon.scale.setScalar(.3);
moon.position.x = 2;
earth.add(moon)

//Camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  .1,
  400);

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

const clock = new THREE.Clock();

//Loop to Render each Frame..
const renderloop = () => {

  const elapsedTime = clock.getElapsedTime();
  earth.position.x = Math.sin(elapsedTime) * 10
  earth.position.z = Math.cos(elapsedTime) * 10
  moon.position.x = Math.sin(elapsedTime) * 2
  moon.position.z = Math.cos(elapsedTime) * 2

  controls.update(); renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop()