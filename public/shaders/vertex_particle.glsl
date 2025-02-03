uniform float u_time;
uniform float u_size;

attribute vec3 random;

float PI = 3.14159265;

//parametric function to generate trifold knot
vec3 get_pos(float progress)
{
    vec3 pos = vec3(0.0);
    float angle = progress * PI * 2.0;

    pos.x = angle;
    pos.y = angle * angle;
    pos.z = 0.0;

    return pos;
}

//get tagent using derivative of parametric function(get_pos) 
vec3 get_tangent(float progress)
{
    vec3 tangent = vec3(0.0);
    float angle = progress * PI * 2.0;
    
    tangent.x = 1.0;
    tangent.y = angle * 2.0;
    tangent.z = 0.0;

    return normalize(tangent);
}

//get normal using derivative of tangent(get_tangent)
vec3 get_normal(float progress)
{
    vec3 normal = vec3(0.0);
    float angle = progress * PI * 2.0;

    normal.x = 0.0;
    normal.y = 2.0;
    normal.z = 0.0;

    return normalize(normal);
}

void main() 
{
    //take position as vector
    vec3 pos = position;
    float progress = fract(u_time * 0.05 + random.x);

    //get particle position based on parametric function
    pos = get_pos(progress);
    vec3 normal = get_normal(progress);
    vec3 tangent = get_tangent(progress);
    vec3 binormal = normalize(cross(normal, tangent));

    float radius = 0.3 + random.z * 0.2;
    float cx = radius * cos(random.y * PI * 2.0 * u_time * 0.1 + random.z * 7.0);
    float cy = radius * sin(random.y * PI * 2.0 * u_time * 0.1 + random.z * 7.0);

    //randomize particle positions across the normal and binormal
    pos += (normal * cx + binormal * cy);


    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    //set the size of the particles
    gl_PointSize = u_size * 1.0 / -mvPosition.z;

    //project the vectors to screenspace using MVP matrices
    gl_Position = projectionMatrix * mvPosition;
}
