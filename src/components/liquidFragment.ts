export const fragmentShader = `
uniform float uTime;
uniform float uTypingSpeed;
uniform float uIntensity;
uniform vec2 uResolution;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uIntenseColor;

// Glitch Uniforms
uniform float uGlitchIntensity; // 0.0 to 1.0
uniform float uGlitchTime;      // Caotic time for glitch

varying vec2 vUv;

// Simplex 3D Noise 
// by Ian McEwan, Ashima Arts
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0.0 + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

// Fractal Brownian Motion
float fbm(vec3 x) {
    float v = 0.0;
    float a = 0.5;
    vec3 shift = vec3(100.0);
    // Optimized: Reduced octaves from 5 to 3 for better performance
    for (int i = 0; i < 3; ++i) {
        v += a * snoise(x);
        x = x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

// Pseudo-random generator
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

// --- CORE FLUID LOGIC (Extracted for RGB Shift) ---
vec3 getFluidColor(vec2 uv) {
    // 1. Zoom in
    vec2 st = uv * 1.5 - 0.75; 
    
    // 2. Animate coordinates
    float speed = uTime * 0.2 + (uTypingSpeed * 0.1);
    
    // 3. Distortion Amplitude
    float distortion = 1.0 + (uTypingSpeed * 2.0);

    vec3 q = vec3(0.0);
    q.x = fbm(vec3(st + vec2(0.0), speed));
    q.y = fbm(vec3(st + vec2(5.2, 1.3), speed));

    vec3 r = vec3(0.0);
    r.x = fbm(vec3(st + distortion * q.xy + vec2(1.7, 9.2), speed));
    r.y = fbm(vec3(st + distortion * q.xy + vec2(8.3, 2.8), speed));

    float f = fbm(vec3(st + distortion * r.xy, speed));

    // Color Palette
    vec3 color1 = uColor1; 
    vec3 color2 = uColor2; 
    vec3 color3 = uColor3;    
    vec3 intenseColor = uIntenseColor;

    // Mixing
    float mixFactor = f * f * f * 4.0; 
    vec3 color = mix(color1, color2, clamp(mixFactor, 0.0, 1.0));
    
    color = mix(color, color3, clamp(length(q), 0.0, 1.0));
    
    color = mix(color, intenseColor, clamp(length(r.x), 0.0, 1.0) * uIntensity);

    return color;
}

void main() {
    vec2 uv = vUv;
    
    // --- GLITCH EFFECT B: BLOCK DISPLACEMENT ---
    if (uGlitchIntensity > 0.0) {
        // Create blocky noise based on rows
        float blockCount = 20.0;
        float id = floor(uv.y * blockCount);
        
        // Random shift per block, animated by glitchTime
        float shift = step(0.8, rand(vec2(uGlitchTime, id))) * (rand(vec2(uGlitchTime * 2.0, id)) - 0.5) * 0.2;
        
        // Apply shift proportional to intensity
        uv.x += shift * uGlitchIntensity * 2.0;
    }

    vec3 finalColor;

    // --- GLITCH EFFECT A: RGB SHIFT (Chromatic Aberration) ---
    if (uGlitchIntensity > 0.0) {
        float shiftAmount = 0.02 * uGlitchIntensity;
        
        // Sample 3 times with offsets
        vec3 colR = getFluidColor(uv - vec2(shiftAmount, 0.0));
        vec3 colG = getFluidColor(uv);
        vec3 colB = getFluidColor(uv + vec2(shiftAmount, 0.0));

        finalColor = vec3(colR.r, colG.g, colB.b);
        
        // Add white noise static on top for "digital corruption" feel
        float noise = rand(uv * uGlitchTime);
        if (noise > 0.9) {
             finalColor += vec3(0.2 * uGlitchIntensity);
        }

    } else {
        // Standard single sample (Optimized)
        finalColor = getFluidColor(uv);
    }

    // Vignette
    float vignette = 1.0 - length(vUv - 0.5) * 1.5;
    finalColor *= clamp(vignette, 0.0, 1.0);

    gl_FragColor = vec4(finalColor, 1.0);
}
`;
