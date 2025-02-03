uniform float u_time;
float PI = 3.14159265;
out vec2 v_uv;
void main() 
{
    v_uv = uv;

    //project the vectors to screenspace using MVP matrices
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
