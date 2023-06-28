import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth - 100, window.innerHeight - 100);
document.body.appendChild(renderer.domElement);

// Create a cube geometry
const size = 2;
const geometry = new THREE.BoxGeometry(size, size, size);

// Create a basic material for the cube
const material = new THREE.MeshBasicMaterial({ color: 0xb3deef, wireframe: true });
const lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
const points = [];
points.push( new THREE.Vector3( - 10, 0, 0 ) );
points.push( new THREE.Vector3( 0, 10, 0 ) );
points.push( new THREE.Vector3( 10, 0, 0 ) )
const lines = new THREE.BufferGeometry().setFromPoints( points );
const line = new THREE.Line( lines, lineMaterial );

const torus = new THREE.TorusGeometry( 10, 3, 16, 100 );
const torusMaterial = new THREE.MeshStandardMaterial( { color: 0x00ff00, wireframe: true } );
const torusMesh = new THREE.Mesh( torus, torusMaterial );

// Create a mesh using the geometry and material
const cube = new THREE.Mesh(geometry, material);
const pointLight = new THREE.PointLight(0xffffff);
const lightHelper = new THREE.PointLightHelper(pointLight);
const ambientLight = new THREE.AmbientLight(0xffffff);
const gridHelper = new THREE.GridHelper(200, 50);
pointLight.position.set(- 10, 20, 10);
scene.add(pointLight, ambientLight, lightHelper, gridHelper);

// Add the cube to the scene
scene.add( torusMesh );
scene.add(cube);
scene.add(line);

// Set the initial camera position
camera.position.z = 30;

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const starGeometry = new THREE.SphereGeometry(0.15, 24, 24);
  const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(starGeometry, starMaterial);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Create a render loop to continuously render the scene
function animate() {
  requestAnimationFrame(animate);

  // Rotate the cube
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  torusMesh.rotation.x += 0.01;
  torusMesh.rotation.y += 0.005;
  torusMesh.rotation.z += 0.01;
  // Render the scene with the camera
  renderer.render(scene, camera);
}

animate();
