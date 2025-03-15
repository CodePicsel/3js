import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//Basic Initializations...
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
const group = new THREE.Group();

//Camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  .1,
  200);

//Ploting Renderer.
const canvas = document.querySelector('#bg');
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
const maxPixelRatio = Math.min(window.devicePixelRatio, 2);
renderer.setPixelRatio(maxPixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 0, 5);

//Lights Initialization
const light = new THREE.AmbientLight(0xffffff, .4);
scene.add(light);

const pointLight = new THREE.PointLight(0xffffff, 15, 100)
pointLight.position.set(2, 2, 2)
scene.add(pointLight)

//Initializing Geometries...
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const uv2CubeGeometry = new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2);
cubeGeometry.setAttribute('uv2', uv2CubeGeometry);

const torusKnotGeometry = new THREE.TorusKnotGeometry(.5, .15, 100, 16);
const uv2TorusKnotGeometry = new THREE.BufferAttribute(torusKnotGeometry.attributes.uv.array, 2);
torusKnotGeometry.setAttribute('uv2', uv2TorusKnotGeometry);

const sphereGeometry = new THREE.SphereGeometry(.5, 32, 32);
const uv2SphereGeometry = new THREE.BufferAttribute(sphereGeometry.attributes.uv.array, 2);
sphereGeometry.setAttribute('uv2', uv2SphereGeometry);

const cylinderGeometry = new THREE.CylinderGeometry(.5, .5, 1, 32)
const uv2CylinderGeometry = new THREE.BufferAttribute(cylinderGeometry.attributes.uv.array, 2);
cylinderGeometry.setAttribute('uv2', uv2CylinderGeometry);

//Loading Textures
const grassAlbedo = textureLoader.load('textures/whispy-grass-meadow-bl/wispy-grass-meadow_albedo.png')
const grassAo = textureLoader.load('textures/whispy-grass-meadow-bl/wispy-grass-meadow_ao.png')
const grassHeight = textureLoader.load('textures/whispy-grass-meadow-bl/wispy-grass-meadow_height.png')
const grassMetallic = textureLoader.load('textures/whispy-grass-meadow-bl/wispy-grass-meadow_metallic.png')
const grassNormal = textureLoader.load('textures/whispy-grass-meadow-bl/wispy-grass-meadow_normal-ogl.png')
const grassRoughness = textureLoader.load('textures/whispy-grass-meadow-bl/wispy-grass-meadow_roughness.png')

//Matrial Initilization Based on Loaded Textures...
const material = new THREE.MeshStandardMaterial();
material.map = grassAlbedo;
material.roughnessMap = grassRoughness;
material.roughness = 1
material.metalnessMap = grassMetallic;
material.metalness = 1
material.normalMap = grassNormal;
material.displacementMap = grassHeight
material.displacementScale = .1
material.aoMap = grassAo
material.aoMapIntensity = 1;

//Create Mesh
const cube = new THREE.Mesh(cubeGeometry, material);
const knot = new THREE.Mesh(torusKnotGeometry, material);
knot.position.x = 1.5;
const sphere = new THREE.Mesh(sphereGeometry, material);
sphere.position.x = 3.15
const cylinder = new THREE.Mesh(cylinderGeometry, material);
cylinder.position.x = -1.5
group.add(cylinder, cube, sphere, knot);
scene.add(group);

//Controls Initialization...
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
})

//Loop to Render each Frame..
const renderloop = () => {
  //Rotation animations..
  // group.children.forEach((child) => {
  //   if (child instanceof THREE.Mesh) {
  //     child.rotation.y += .01;
  //   }
  // })
  controls.update(); renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop()