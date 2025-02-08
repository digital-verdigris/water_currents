import * as THREE from 'three';

//class for current particles
class particles
{
    constructor(vertex_shader, fragment_shader, texture, curve)
    {
        //generate particles
        this.particle_cnt = 10000;
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(this.particle_cnt * 3);
        this.randoms = new Float32Array(this.particle_cnt * 3);
        this.tangents = new Float32Array(this.particle_cnt * 3);

        //randomly set particle positions and randoms (for flow intensity)
        for (let i = 0; i < this.particle_cnt; i++) 
        {
            const progress = i / this.particle_cnt;

            const position = curve.getPointAt(progress);

            const tangent = curve.getTangentAt(progress).normalize();

            const normal = new THREE.Vector3(0, 0, 1).cross(tangent).normalize(); 

            const radius = 0.2 + Math.random() * 0.2;
            const angle = Math.random() * Math.PI * 2;

            const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();

            const offset = new THREE.Vector3().addScaledVector(normal, radius * Math.cos(angle))
                .addScaledVector(binormal, radius * Math.sin(angle));

            //set particle position
            this.positions[i * 3] = position.x + offset.x;
            this.positions[i * 3 + 1] = position.y + offset.y;
            this.positions[i * 3 + 2] = position.z + offset.z;

            //randoms for shader
            this.randoms[i * 3] = Math.random() * 2 - 1;
            this.randoms[i * 3 + 1] = Math.random() * 2 - 1;
            this.randoms[i * 3 + 2] = Math.random() * 2 - 1;

            this.tangents[i * 3] = tangent.x;
            this.tangents[i * 3 + 1] = tangent.y;
            this.tangents[i * 3 + 2] = tangent.z;
        }
        //set the attributes in the buffer
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.geometry.setAttribute('random', new THREE.BufferAttribute(this.randoms, 3));
        this.geometry.setAttribute('tangent', new THREE.BufferAttribute(this.tangents, 3));

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
                        u_texture: { value: texture },
                        u_speed: { value: 0.0}
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

    update()
    {

    }
}

//class for current textured cube
class tube 
{
    constructor(vertex_shader, fragment_shader, texture, curve)
    {   
        //create the tube geometry using the curve
        this.geometry = new THREE.TubeGeometry(curve, 100, 0.4, 100, false);

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
                        u_stripes: { value: texture },
                        u_speed: { value: 0.1},
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
    constructor(scene, resources, curve)
    {
        //create particles/tube and add both to scene
        this.particles = new particles(resources.particle_vertex_shader, resources.particle_fragment_shader, resources.particle_texture, curve);
        this.tube = new tube(resources.tube_vertex_shader, resources.tube_fragment_shader, resources.tube_texture, curve);
        this.particles.add_to_scene(scene);
        this.tube.add_to_scene(scene);
    }

    animate() //animate the particles and texture by updating the time uniform in the shaders
    {
        const time = performance.now() / 1000;
        this.particles.material.uniforms.u_time.value = time;
        this.tube.material.uniforms.u_time.value = time;
    }

    set_speed(new_speed) //change the speed of the current flow
    {
        this.particles.material.uniforms.u_speed.value = new_speed * 5.0;
        this.tube.material.uniforms.u_speed.value = new_speed;
    }
}