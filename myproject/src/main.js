import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Pane } from 'tweakpane'

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const torusKnotGeometry = new THREE.TorusKnotGeometry(.5, .15, 100, 16);
const sphereGeometry = new THREE.SphereGeometry(.5, 32, 32);
const cylinderGeometry = new THREE.CylinderGeometry(.5, .5, 1, 32)
const group = new THREE.Group();

const grassAlbedo = textureLoader.load('textures/whispy-grass-meadow-bl/wispy-grass-meadow_albedo.png')
const grassAo = textureLoader.load('textures/whispy-grass-meadow-bl/wispy-grass-meadow_ao.png')
const grassHeight = textureLoader.load('textures/whispy-grass-meadow-bl/wispy-grass-meadow_height.png')
const grassMetallic = textureLoader.load('textures/whispy-grass-meadow-bl/wispy-grass-meadow_metallic.png')
const grassNormal = textureLoader.load('textures/whispy-grass-meadow-bl/wispy-grass-meadow_normal-ogl.png')
const grassRoughness = textureLoader.load('textures/whispy-grass-meadow-bl/wispy-grass-meadow_roughness.png')

const material = new THREE.MeshStandardMaterial();
material.map = grassAlbedo;
material.roughnessMap = grassRoughness;
material.metalnessMap = grassMetallic;

const cube = new THREE.Mesh(cubeGeometry, material);
const knot = new THREE.Mesh(torusKnotGeometry, material);
knot.position.x = 1.5;

const sphere = new THREE.Mesh(sphereGeometry, material);
sphere.position.x = 3.15
const cylinder = new THREE.Mesh(cylinderGeometry, material);
cylinder.position.x = -1.5

group.add(cylinder, cube, sphere, knot);
scene.add(group);

const light = new THREE.AmbientLight(0xffffff, .4);
scene.add(light);

const pointLight = new THREE.PointLight(0xffffff, 10, 100)
pointLight.position.set(2, 2, 2)
scene.add(pointLight)

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  .1,
  200);

const canvas = document.querySelector('#bg');
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

const maxPixelRatio = Math.min(window.devicePixelRatio, 2);
renderer.setPixelRatio(maxPixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 0, 5);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
})

const renderloop = () => {
  group.children.forEach((child) => {
    if (child instanceof THREE.Mesh) {
      child.rotation.y += .01;
    }
  })
  controls.update(); renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop()