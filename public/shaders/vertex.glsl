uniform float u_time;
uniform float u_size;

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

//get tagent using derivative of parametric function(get_pos) 
vec3 get_tangent(float progress)
{
    vec3 tangent = vec3(0.0);
    float angle = progress * PI * 2.0;

    tangent.x = cos(angle) + 4.0 * cos(2.0 * angle);
    tangent.y = -sin(angle) + 4.0 * sin(2.0 * angle);
    tangent.z = 3.0 * -cos(3.0 * angle);

    return normalize(tangent);
}

//get normal using derivative of tangent(get_tangent)
vec3 get_normal(float progress)
{
    vec3 normal = vec3(0.0);
    float angle = progress * PI * 2.0;

    normal.x = -sin(angle) - 8.0 * sin(2.0 * angle);
    normal.y = -cos(angle) + 8.0 * cos(2.0 * angle);
    normal.z = 9.0 * sin(3.0 * angle);

    return normalize(normal);
}

void main() 
{
    //take position as vector
    vec3 pos = position;
    float progress = fract(u_time * 0.01 + random.x);

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

    //set the size of the particles
    gl_PointSize = u_size;

    //project the vectors to screenspace using MVP matrices
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
}
