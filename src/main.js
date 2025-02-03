import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';

//shader loading fuction
async function load_shader(path) 
{
  const response = await fetch(path);
  return response.text();
}

//setup scene
const scene = new THREE.Scene();

//setup camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//set camera position
camera.position.z = 5;

//setup renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x123456);

//setup controls
const controls = new OrbitControls(camera, renderer.domElement);

document.body.appendChild(renderer.domElement);

//generate particles
const particle_cnt = 10000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particle_cnt * 3);
const randoms = new Float32Array(particle_cnt * 3);

//randomly set particle positions and randoms (for flow intensity)
for (let i = 0; i < particle_cnt; i++) 
{
  positions[i * 3] = Math.random() * 2 - 1;     // x
  positions[i * 3 + 1] = Math.random() * 2 - 1; // y
  positions[i * 3 + 2] = Math.random() * 2 - 1; // z

  randoms[i * 3] = Math.random() * 2 - 1;     // x
  randoms[i * 3 + 1] = Math.random() * 2 - 1; // y
  randoms[i * 3 + 2] = Math.random() * 2 - 1; // z
}

//set the position attribute in the buffer
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('random', new THREE.BufferAttribute(randoms, 3));

const texture_loader = new THREE.TextureLoader();
const sphere_normal_map = texture_loader.load('/textures/sphere_normal.png');

(async function()
{

  const vertex_shader = await load_shader('/shaders/vertex.glsl');
  console.log("vertex shader loaded:", vertex_shader);

  const fragment_shader = await load_shader('/shaders/fragment.glsl');
  console.log("fragment shader loaded:", fragment_shader);

  const material = new THREE.ShaderMaterial
  (
      {
        vertexShader: vertex_shader,
        fragmentShader: fragment_shader,
        uniforms:
        {
          u_time: {value: 0.0},
          u_size: {value: 5.0},
          u_normals: {value: sphere_normal_map}
        },
        transparent: true,
        depthTest: false,
      }
    );
  
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  animate(material);
})();

//animation loop
function animate(material) 
{
  const time = performance.now() / 1000;
  material.uniforms.u_time.value = time;

  requestAnimationFrame(() => animate(material));
  controls.update();
  renderer.render(scene, camera);
}
