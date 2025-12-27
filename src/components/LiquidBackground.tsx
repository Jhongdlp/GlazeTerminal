import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { fragmentShader } from "./liquidFragment";
import config from "../config.json";

// Linear interpolation helper
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const LiquidPlane = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { size } = useThree();

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uTypingSpeed: { value: 0.0 }, // 0.0 = Calm, 1.0 = Turbulent
            uIntensity: { value: 0.0 },
            uResolution: { value: new THREE.Vector2(0, 0) }, // Initial value, updated in useFrame
            // Inject colors from config
            uColor1: { value: new THREE.Vector3(...config.theme.liquid.color1) },
            uColor2: { value: new THREE.Vector3(...config.theme.liquid.color2) },
            uColor3: { value: new THREE.Vector3(...config.theme.liquid.color3) },
            uIntenseColor: { value: new THREE.Vector3(...config.theme.liquid.intenseColor) },
            // Glitch Uniforms
            uGlitchIntensity: { value: 0.0 },
            uGlitchTime: { value: 0.0 },
        }),
        [] // No dependencies, stable reference
    );

    // Reactivity State
    const targetSpeed = useRef(0);
    const currentSpeed = useRef(0);
    const glitchIntensity = useRef(0);

    // Listen for typing events
    useMemo(() => {
        const handleTyping = () => {
             // Jump target speed up (max 1.0)
             targetSpeed.current = 1.0;
             // Reset after short delay to create "pulse"
             setTimeout(() => { targetSpeed.current = 0; }, 150);
        };

        const handleError = () => {
            // Instant glitch spike
            glitchIntensity.current = 1.0;
        };

        window.addEventListener('glaze-typing', handleTyping);
        window.addEventListener('glaze-error', handleError);
        return () => {
             window.removeEventListener('glaze-typing', handleTyping);
             window.removeEventListener('glaze-error', handleError);
        };
    }, []);

    useFrame((state, delta) => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.getElapsedTime();

            // Smoothly interpolate current speed towards target
            // If target is 0, we decay slowly (0.5). If target is 1, we ramp up fast (5.0).
            const lerpFactor = targetSpeed.current > currentSpeed.current ? 5.0 * delta : 0.5 * delta;
            currentSpeed.current = lerp(currentSpeed.current, targetSpeed.current, lerpFactor);

            material.uniforms.uTypingSpeed.value = currentSpeed.current;
            
            // Map speed to intensity: 
            // If speed > 0.5, start introducing intense color.
            // At speed 1.0, intensity should be max (e.g., 0.8 or 1.0).
            const intensity = Math.max(0, (currentSpeed.current - 0.5) * 2.0);
            material.uniforms.uIntensity.value = intensity;

            // --- Glitch Update ---
            // Decay glitch intensity (faster decay = spike & recover)
            if (glitchIntensity.current > 0.001) {
                glitchIntensity.current = lerp(glitchIntensity.current, 0, 5.0 * delta); // Approx 400-600ms decay
                material.uniforms.uGlitchIntensity.value = glitchIntensity.current;
                
                // Chaotic timer for glitch flickering
                material.uniforms.uGlitchTime.value += delta * 50.0; 
            } else {
                 material.uniforms.uGlitchIntensity.value = 0.0;
            }

            // Update resolution dynamically without re-creating uniforms
            material.uniforms.uResolution.value.set(size.width, size.height);
        }
    });

    return (
        <mesh ref={meshRef} scale={[size.width, size.height, 1]}>
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
            />
        </mesh>
    );
};

export const LiquidBackground = () => {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas
                camera={{ position: [0, 0, 1] }}
                orthographic
                gl={{
                    powerPreference: "high-performance",
                    alpha: true,
                    antialias: false,
                    stencil: false,
                    depth: false
                }}
                dpr={0.5}
            >
                <LiquidPlane />
            </Canvas>
        </div>
    );
};
