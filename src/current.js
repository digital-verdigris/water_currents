import * as THREE from 'three';

//class for current particles
class particles
{
    constructor(vertex_shader, fragment_shader, texture)
    {
        //generate particles
        this.particle_cnt = 10000;
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(this.particle_cnt * 3);
        this.randoms = new Float32Array(this.particle_cnt * 3);

        //randomly set particle positions and randoms (for flow intensity)
        for (let i = 0; i < this.particle_cnt; i++) 
        {
            this.positions[i * 3] = Math.random() * 2 - 1;     // x
            this.positions[i * 3 + 1] = Math.random() * 2 - 1; // y
            this.positions[i * 3 + 2] = Math.random() * 2 - 1; // z

            this.randoms[i * 3] = Math.random() * 2 - 1;       // x
            this.randoms[i * 3 + 1] = Math.random() * 2 - 1;   // y
            this.randoms[i * 3 + 2] = Math.random() * 2 - 1;   // z
        }
        //set the position attribute in the buffer
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.geometry.setAttribute('random', new THREE.BufferAttribute(this.randoms, 3));

        //create the material
        this.material = new THREE.ShaderMaterial
            (
                {
                    side: THREE.DoubleSide,
                    vertexShader: vertex_shader,
                    fragmentShader: fragment_shader,
                    uniforms:
                    {
                        u_time: { value: 0.0 },
                        u_size: { value: 5.0 },
                        u_normals: { value: texture }
                    },
                    transparent: true,
                    depthTest: false,
                }
            );
        //create THREE particle object for scene
        this.particles = new THREE.Points(this.geometry, this.material);
    }

    //add the particles to the scene
    add_to_scene(scene)
    {
        scene.add(this.particles);
    }
}

//class for current textured cube
class tube 
{
    constructor(vertex_shader, fragment_shader, texture)
    {
        //generate points along parametric function to generate curve
        let points = [];
        for (let i = 0; i <= 100; i++) 
            {
                let angle = 2 * Math.PI * i / 100;
                let x = Math.sin(angle) + 2.0 * Math.sin(2.0 * angle);
                let y = Math.cos(angle) - 2.0 * Math.cos(2.0 * angle);
                let z = -Math.sin(3.0 * angle);

                points.push(new THREE.Vector3(x, y, z));
            }

        //create closed curve using generated points
        let curve = new THREE.CatmullRomCurve3(points);
        curve.closed = true;
        
        //create the tube geometry using the curve
        this.geometry = new THREE.TubeGeometry(curve, 100, 0.4, 100, true);

        //create a material for the tube
        this.material = new THREE.ShaderMaterial
            (
                {
                    side: THREE.DoubleSide,
                    vertexShader: vertex_shader,
                    fragmentShader: fragment_shader,
                    uniforms:
                    {
                        u_time: { value: 0.0 },
                        u_stripes: { value: texture }
                    },
                    depthTest: false,
                    transparent: true,
                }
            );

        //create THREE mesh object for scene
        this.tube = new THREE.Mesh(this.geometry, this.material);
    }

    //add tube to the scene
    add_to_scene(scene) 
    {
        scene.add(this.tube);
    }
}

//exported current class for use
export class current
{
    constructor(scene, particle_vertex_shader, particle_fragment_shader, particle_texture, tube_vertex_shader, tube_fragment_shader, tube_texture)
    {
        //create particles/tube and add both to scene
        this.particles = new particles(particle_vertex_shader, particle_fragment_shader, particle_texture);
        this.tube = new tube(tube_vertex_shader, tube_fragment_shader, tube_texture);
        this.particles.add_to_scene(scene);
        this.tube.add_to_scene(scene);
    }

    animate() //animate the particles and texture by updating the time uniform in the shaders
    {
        const time = performance.now() / 1000;
        this.particles.material.uniforms.u_time.value = time;
        this.tube.material.uniforms.u_time.value = time;
    }
}