import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import "./styles.css";
import normalMap from "../assets/textures/normalMaps/rusty_metal_grid_diff_4k.jpg";
import moodyClouds from "../assets/images/moody-clouds.jpg";

document.getElementById(
  "scene-container"
).style.backgroundImage = `url(${moodyClouds})`;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("scene-container").appendChild(renderer.domElement);

const rustyGridMap = new THREE.TextureLoader().load(normalMap);
console.log(rustyGridMap);
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0xaaaaaa,
  normalMap: rustyGridMap,
});
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

const edges = new THREE.EdgesGeometry(geometry);
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0xff0000,
  linewidth: 2,
});
const outline = new THREE.LineSegments(edges, lineMaterial);
outline.position.set(0, 0, 0);
cube.add(outline);

const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10); // Position the light
scene.add(light);

camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isAnimating = true;

window.addEventListener("mousedown", onMouseDown, false);
window.addEventListener("mouseup", onMouseUp, false);

function onMouseDown(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(cube);
  if (intersects.length > 0) {
    isAnimating = false;
  }
}

function onMouseUp() {
  isAnimating = true;
}

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  if (isAnimating) {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
