import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**+
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// // helper

// const helper = new THREE.AxesHelper();
// scene.add(helper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcap1Texture = textureLoader.load("./textures/matcaps/3.png");
const matcap2Texture = textureLoader.load("./textures/matcaps/12.png");
const matcap3Texture = textureLoader.load("./textures/matcaps/9.png");
const matcap4Texture = textureLoader.load("./textures/matcaps/8.png");

/**
 * Fonts
 */
const donuts = [];
const fontLoader = new THREE.FontLoader();
fontLoader.load("./fonts/helvetiker_bold.typeface.json", (font) => {
  console.log("font loaded");

  const textGeometry = new THREE.TextBufferGeometry("Hello World", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 8,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  });

  textGeometry.center();

  const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcap1Texture });
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);

  const donutGeometry = new THREE.SphereBufferGeometry(0.3, 16, 16);
  const conGeometry = new THREE.ConeBufferGeometry(0.5, 1, 4);
  const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);

  const randomArray = [donutGeometry, conGeometry, boxGeometry];

  const donutMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcap2Texture
  });
  const donut2Material = new THREE.MeshMatcapMaterial({
    matcap: matcap3Texture
  });
  const donut3Material = new THREE.MeshMatcapMaterial({
    matcap: matcap4Texture
  });

  const randomTexture = [donutMaterial, donut2Material, donut3Material];

  for (let i = 0; i < 100; i++) {
    // const donut = new THREE.Mesh(donutGeometry, donutMaterial);

    const donut = new THREE.Mesh(
      randomArray[Math.floor(Math.random() * 3)],
      randomTexture[Math.floor(Math.random() * 3)]
    );
    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();

    donut.scale.set(scale, scale, scale);
    donuts.push(donut);

    scene.add(donut);
  }

  const clock = new THREE.Clock();

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    text.rotation.y = 0.2 * elapsedTime;
    window.requestAnimationFrame(tick);
  };

  tick();
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("mousemove", onMouseMove);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

/**
 * Raycaster
 */

const mouseCaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.autoRotate = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

let currentIntersect = null;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Rotate Camera
  mouseCaster.setFromCamera(mouse, camera);
  const intersects = mouseCaster.intersectObjects(donuts);

  for (const obj of donuts) {
    obj.material.wireframe = false;
  }

  if (intersects.length) {
    if (currentIntersect) {
      // intersects[0]
      currentIntersect.object.material.wireframe = true;
    }
    currentIntersect = intersects[0];
  } else {
    if (currentIntersect) {
      console.log("mouse leave");
    }

    currentIntersect = null;
  }

  camera.rotateX(Math.PI);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
