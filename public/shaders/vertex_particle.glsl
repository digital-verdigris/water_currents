uniform float u_time;
uniform float u_size;
uniform float u_speed;

attribute vec3 random;
attribute vec3 tangent;

float PI = 3.14159265;

float calculate_progress(float base_progress, float time, float speed, float randomness) {
    return mod(base_progress + time * speed + randomness, 1.0);
}

void main() 
{
    float base_progress = random.x;
    float progress = fract(base_progress + u_time * u_speed);
    //take position as vector
    vec3 pos = position + tangent * progress;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    //set the size of the particles
    gl_PointSize = u_size * 1.0 / -mvPosition.z;

    //project the vectors to screenspace using MVP matrices
    gl_Position = projectionMatrix * mvPosition;
}
