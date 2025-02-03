uniform sampler2D u_stripes;
uniform float u_time;

in vec2 v_uv;
void main() 
{
    float time1 = u_time * 0.1;
    float stripes_texture1 = texture2D(u_stripes, v_uv - time1 * 1.5).r;
    float stripes_texture2 = texture2D(u_stripes, v_uv * vec2(8.0, 4.0) - time1 * 1.5).r;
    
    float alpha = min(stripes_texture1, stripes_texture2);
    
    gl_FragColor =
    gl_FragColor = vec4(vec3(1.0), alpha);
}