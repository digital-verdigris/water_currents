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
renderer.setClearColor(0x003366);

//setup controls
const controls = new OrbitControls(camera, renderer.domElement);

document.body.appendChild(renderer.domElement);

function on_window_resize()
{
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', on_window_resize, false);

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

const sphere_normal_map = new THREE.TextureLoader().load('/textures/sphere_normal.png');

(async function()
{

  const vertex_particle_shader = await load_shader('/shaders/vertex_particle.glsl');
  console.log("vertex shader loaded:", vertex_particle_shader);

  const fragment_particle_shader = await load_shader('/shaders/fragment_particle.glsl');
  console.log("fragment shader loaded:", fragment_particle_shader);

  const particle_material = new THREE.ShaderMaterial
    (
      {
        side: THREE.DoubleSide,
        vertexShader: vertex_particle_shader,
        fragmentShader: fragment_particle_shader,
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
  
  const particles = new THREE.Points(geometry, particle_material);
  scene.add(particles);

  let points = []

  for(let i = 0; i <= 100; i++)
  {
    let angle = 2*Math.PI*i/100;
    let x = Math.sin(angle) + 2.0 * Math.sin(2.0 * angle);
    let y = Math.cos(angle) - 2.0 * Math.cos(2.0 * angle);
    let z = -Math.sin(3.0 * angle);

    points.push(new THREE.Vector3(x, y, z));
  }

  let curve = new THREE.CatmullRomCurve3(points);
  curve.closed = true;
  let tube_geo = new THREE.TubeGeometry(curve, 100, 0.4, 100, true);

  const stripes_texture = new THREE.TextureLoader().load('/textures/water_caustic_texture.jpg');

  stripes_texture.wrapS = THREE.RepeatWrapping;
  stripes_texture.wrapT = THREE.RepeatWrapping;

  const vertex_tube_shader = await load_shader('/shaders/vertex_tube.glsl');
  console.log("vertex shader loaded:", vertex_tube_shader);

  const fragment_tube_shader = await load_shader('/shaders/fragment_tube.glsl');
  console.log("fragment shader loaded:", fragment_tube_shader);
  
  const tube_material = new THREE.ShaderMaterial
    (
      {
        vertexShader: vertex_tube_shader,
        fragmentShader: fragment_tube_shader,
        uniforms:
        {
          u_time: { value: 0.0 },
          u_stripes: { value: stripes_texture }
        },
        transparent: true,
      }
    );

  const tube = new THREE.Mesh(tube_geo, tube_material);
  scene.add(tube);

  animate(particle_material, tube_material);
})();

//animation loop
function animate(particle_material, tube_material) 
{
  const time = performance.now() / 1000;
  particle_material.uniforms.u_time.value = time;
  tube_material.uniforms.u_time.value = time;

  requestAnimationFrame(() => animate(particle_material, tube_material));
  controls.update();
  renderer.render(scene, camera);
}
