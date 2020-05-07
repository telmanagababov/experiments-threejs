import * as THREE from '../node_modules/three/build/three.module.js'
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { TrackballControls } from '../node_modules/three/examples/jsm/controls/TrackballControls.js';

const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
const light = createLight();
const cube = createCube();
const line = createLine();
const controls = createControls(camera, renderer);

const update = () => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    controls.update();
};

const setupText = (font) => {
	const text = createText(font, 'Example');
    scene.add(text);
};

const setupModel = (model) => {
    const modelScene = model.scene;
    modelScene.scale.x = 0.02;
    modelScene.scale.y = 0.02;
    modelScene.scale.z = 0.02;
    modelScene.rotation.x = 0.5;
    scene.add(modelScene);
};

scene.add(cube);
scene.add(line);
scene.add(light);

loadText(setupText);
loadModel(setupModel);
createControls(camera, renderer);

animate(scene, camera, renderer, update);

function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xCCCCCC);
    return scene;
}

function createCamera() {
    const camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000,
    );
    camera.position.set(0, 0, 40);
    camera.lookAt(0, 0, 0);
    return camera;
}

function createRenderer() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(
        window.innerWidth, 
        window.innerHeight,
    );
    attachRenderer(renderer);
    return renderer;
}

function attachRenderer(renderer) {
    document.body.appendChild(renderer.domElement);
}

function createControls(camera, renderer) {
    const controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.keys = [ 65, 83, 68 ];
    return controls;
}

function animate(scene, camera, renderer, update) {
    requestAnimationFrame(() => {
        animate(scene, camera, renderer, update); 
    });
    update();
	renderer.render(scene, camera);
}

function createCube() {
    const geometry = new THREE.BoxGeometry(5, 5, 5)
        .translate(-10, -2, 0);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    return new THREE.Mesh(geometry, material);
}

function createLine() {
    const points = [
        new THREE.Vector3(-5, -10, 10),
        new THREE.Vector3(5, -5, 5),
        new THREE.Vector3(10, 0, 0),
        new THREE.Vector3(-5, -5, -5),
    ];
    const geometry = new THREE.BufferGeometry()
        .setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    return new THREE.Line(geometry, material);
}

function loadText(callback) {
    const loader = new THREE.FontLoader();
    loader.load('fonts/gentilis_bold.typeface.json', callback);
}

function createText(font, text) {
    const geometry = new THREE.TextGeometry(text, { font, size: 2, height: 2 })
        .translate(-5, -20, 0)
        .rotateZ(1);
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    return new THREE.Mesh(geometry, material);
}

function loadModel(callback) {
    const loader = new GLTFLoader(); 
    loader.load(
        'models/inspector-car/scene.gltf',
        callback,
        status => console.info(`model loading... ${(status.loaded / status.total * 100).toFixed(2)}%`),
        error => console.error(error),
    );
}

function createLight() {
    const light = new THREE.PointLight(0xffffff, 5, 5000);
    light.position.set(50, 50, 50);
    return light;
}