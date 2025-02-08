uniform float u_time;
uniform float u_size;
uniform float u_speed;

attribute vec3 random;
attribute vec3 tangent;

float PI = 3.14159265;

void main() 
{
    //take position as vector
    vec3 pos = position;

    pos += random.x * 0.1; 
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    //set the size of the particles
    gl_PointSize = u_size * 1.0 / -mvPosition.z;

    //project the vectors to screenspace using MVP matrices
    gl_Position = projectionMatrix * mvPosition;
}
