uniform float uTime;
attribute vec3 random;

float PI = 3.14159265;

//parametric function to generate trifold knot
vec3 get_pos(float progress)
{
    vec3 pos = vec3(0.0);
    float angle = progress * PI * 2.0;

    pos.x = sin(angle) + 2.0 * sin(2.0 * angle);
    pos.y = cos(angle) - 2.0 * cos(2.0 * angle);
    pos.z = -sin(3.0 * angle);


    return pos;
}

void main() 
{
    //take position as vector
    vec3 pos = position;

    //pos.x += fract(uTime + random.x);
    pos = get_pos(fract(uTime * 0.01 + random.x));

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    //project the vectors to screenspace using MVP matrices
    gl_Position = projectionMatrix * mvPosition;
}
