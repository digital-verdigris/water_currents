import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { current } from './current.js';

async function load_current_resources() 
{
  const particle_vertex_shader = await load_shader('/shaders/vertex_particle.glsl');
  console.log("vertex shader loaded:", particle_vertex_shader);

  const particle_fragment_shader = await load_shader('/shaders/fragment_particle.glsl');
  console.log("fragment shader loaded:", particle_fragment_shader);

  const tube_vertex_shader = await load_shader('/shaders/vertex_tube.glsl');
  console.log("vertex shader loaded:", tube_vertex_shader);

  const tube_fragment_shader = await load_shader('/shaders/fragment_tube.glsl');
  console.log("fragment shader loaded:", tube_fragment_shader);

  const particle_texture = await new THREE.TextureLoader().loadAsync('/textures/sphere_normal.png');
  const tube_texture = await new THREE.TextureLoader().loadAsync('/textures/water_caustic_texture.jpg');

  tube_texture.wrapS = THREE.RepeatWrapping;
  tube_texture.wrapT = THREE.RepeatWrapping;

  return{
    particle_vertex_shader,
    particle_fragment_shader,
    tube_vertex_shader,
    tube_fragment_shader,
    particle_texture,
    tube_texture
  };
}

//helper function to load shaders
async function load_shader(path) 
{
  const response = await fetch(path);
  return response.text();
}

/* 
scene setup
*/

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

//resizes viewport on window resize
function on_window_resize()
{
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', on_window_resize, false);


/*
current generation
*/

async function main()
{
  //load shaders and textures
  const current_resources = await load_current_resources();

  //create a current instance
  const a_current = new current(scene, current_resources);
  
  //animate scene
  function animate() 
  {
    requestAnimationFrame(animate);
    a_current.animate(); //update uniforms
    controls.update(); //update scene based on control usage
    renderer.render(scene, camera); //render the scene
  }

  animate();
}

main();
