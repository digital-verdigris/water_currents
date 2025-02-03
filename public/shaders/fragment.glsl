uniform sampler2D u_normals;

void main() 
{
    vec3 color = vec3(0.651, 0.847, 1.0);
    vec2 st = gl_PointCoord.xy;
    st.y = 1.0 - st.y;

    float disc = length(st - vec2(0.5));
    float alpha = smoothstep(0.5, 0.48, disc);

    vec3 normal_tex = texture2D(u_normals, st).rgb;

    vec3 normal = vec3(normal_tex.rg * 2.0 - 1.0, 0.0);
    normal.z = sqrt(1.0 - normal.x * normal.x - normal.y * normal.y);

    normal = normalize(normal);

    vec3 light_pos = vec3(1.0);

    float diffuse = max(0.0, dot(normal, normalize(light_pos)));

    //set the colors for the particles
    gl_FragColor = vec4(vec3(diffuse), alpha * diffuse);
}