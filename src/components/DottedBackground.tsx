'use client';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
	const { theme } = useTheme();

	const containerRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<{
		scene: THREE.Scene;
		camera: THREE.PerspectiveCamera;
		renderer: THREE.WebGLRenderer;
		particles: THREE.Points[];
		animationId: number;
		count: number;
	} | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const SEPARATION = 150;
		const AMOUNTX = 40;
		const AMOUNTY = 60;

		// Scene setup
		const scene = new THREE.Scene();
		// Adjust fog to match background
		scene.fog = new THREE.Fog(0x000000, 2000, 10000);

		const camera = new THREE.PerspectiveCamera(
			60,
			window.innerWidth / window.innerHeight,
			1,
			10000,
		);
		camera.position.set(0, 355, 1220);

		const renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
            powerPreference: "low-power", // Hint for dual-gpu systems
		});
        // Optimization: Cap pixel ratio. High DPI rendering on full screen canvas is expensive.
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
		renderer.setSize(window.innerWidth, window.innerHeight);
		// renderer.setClearColor(scene.fog.color, 0); // Transparent background

		containerRef.current.appendChild(renderer.domElement);

		const positions: number[] = [];
		const colors: number[] = [];

		// Create geometry for all particles
		const geometry = new THREE.BufferGeometry();

		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
				const y = 0; // Will be animated
				const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

				positions.push(x, y, z);
                
                // Color logic
                // Maximum visibility: Pure white
				colors.push(1.0, 1.0, 1.0); 
			}
		}

		geometry.setAttribute(
			'position',
			new THREE.Float32BufferAttribute(positions, 3),
		);
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage));

		// Create material
		const material = new THREE.PointsMaterial({
			size: 9, // Even larger for maximum visibility
			vertexColors: true,
			transparent: true,
			opacity: 1.0, // Fully opaque
			sizeAttenuation: true,
		});

		// Create points object
		const points = new THREE.Points(geometry, material);
		scene.add(points);

		let count = 0;
		let animationId = 0;
        let wasActive = false;
        
        // Typing Interactivity State
        let isTyping = false;
        let typingTimeout: any; // Use any to avoid NodeJS namespace issues in browser env
        let pulseIntensity = 0;
        let errorIntensity = 0; // State for error animation

        const handleTyping = () => {
            isTyping = true;
            pulseIntensity = 1.0;
            if (typingTimeout) clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
                isTyping = false;
            }, 200);
        };

        const handleError = () => {
             // Spike error intensity
             errorIntensity = 1.0;
        };

        window.addEventListener('glaze-typing', handleTyping);
        window.addEventListener('glaze-error', handleError);

		// Animation function
		const animate = () => {
			animationId = requestAnimationFrame(animate);

			const positionAttribute = geometry.attributes.position;
            const colorAttribute = geometry.attributes.color;
			const positions = positionAttribute.array as Float32Array;
            const colors = colorAttribute.array as Float32Array;

            // Decay pulse intensity
            if (pulseIntensity > 0) {
                pulseIntensity -= 0.05;
                if (pulseIntensity < 0) pulseIntensity = 0;
            }

            // Decay error intensity
            if (errorIntensity > 0) {
                errorIntensity -= 0.02; // Slower decay for error, lingers a bit
                if (errorIntensity < 0) errorIntensity = 0;
            }

			let i = 0;
            const hasActivity = isTyping || pulseIntensity > 0 || errorIntensity > 0;

			for (let ix = 0; ix < AMOUNTX; ix++) {
				for (let iy = 0; iy < AMOUNTY; iy++) {
					const index = i * 3;

                    // Base Wave Animation
					let newY = Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;

                    // Chaotic Error "Shake"
                    // Add random noise to Y position based on error intensity
                    if (errorIntensity > 0) {
                        const shakeAmount = 50.0 * errorIntensity;
                        const randomOffset = (Math.random() - 0.5) * shakeAmount;
                        newY += randomOffset;
                    }

                    // Apply Y position
					positions[index + 1] = newY;


                    // Optimization: Only update colors if there is active interaction
                    // If idle (white), we skip the color calculation loop to save CPU
                    if (hasActivity) {
                        const accentR = 0.0; // Cyan/Blueish tint when typing
                        const accentG = 1.0; 
                        const accentB = 1.0;


                        if (errorIntensity > 0) {
                            // Error Overrides everything
                            // Pulse Red
                            // R: 1
                            colors[index] = 1.0; 
                            // G/B: Fade out
                            colors[index + 1] = 1.0 * (1 - errorIntensity);
                            colors[index + 2] = 1.0 * (1 - errorIntensity);
                        } else if (isTyping || pulseIntensity > 0) {
                            const t = pulseIntensity;
                            colors[index] = 1.0 * (1 - t) + accentR * t;
                            colors[index + 1] = 1.0 * (1 - t) + accentG * t;
                            colors[index + 2] = 1.0 * (1 - t) + accentB * t;
                        }
                    } else {
                        // Ensure it's white if we just came out of activity?
                        // If we skip loop, effectively we leave it as last frame.
                        // We need a way to verify "just finished". 
                        // Simplified: If intensity is 0, we can assume it settled to white in the last >0 frame?
                        // Actually pulseIntensity decays to 0. The last frame where pulse > 0 would set it to near white.
                        // Ideally we set it to pure white one last time.
                        // For safety/simplicity in this optimization: 
                        // We always set to white if !hasActivity to ensure no stuck colors, 
                        // BUT we can check if the first pixel is already white to avoid iterating?
                        // Let's just run the reset loop once if needed? 
                        // Or cheaper: Just run it. The optimization is mainly for complex gradients. 
                        // Actually, let's keep it simple: Just conditionalize the update flag!
                        
                        colors[index] = 1.0;
                        colors[index + 1] = 1.0;
                        colors[index + 2] = 1.0;
                    }

					i++;
				}
			}

			positionAttribute.needsUpdate = true;
            
            // Optimization: Only upload color buffer if active or was active last frame (to clear colors)
            if (hasActivity || wasActive) {
                 colorAttribute.needsUpdate = true;
            }
            wasActive = hasActivity;

            // Dynamic "Glow" effect: Pulse size
            // Base size 9, pulses up to 12
            // If error, maybe spike size too?
            const extraSize = errorIntensity > 0 ? (Math.random() * 5 * errorIntensity) : (pulseIntensity * 3);
            material.size = 9 + extraSize;
            material.needsUpdate = true;

			renderer.render(scene, camera);
            
            // Dynamic Speed
            // Base speed 0.1, adds up to 0.3 when typing
            // If error, speed up chaos?
            const speedBoost = errorIntensity > 0 ? 0.5 : (pulseIntensity * 0.3);
			count += 0.1 + speedBoost;
		};

		// Handle window resize
		const handleResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};

		window.addEventListener('resize', handleResize);

		// Start animation
		animate();

		// Store references
		sceneRef.current = {
			scene,
			camera,
			renderer,
			particles: [points],
			animationId,
			count,
		};

		// Cleanup function
		return () => {
			window.removeEventListener('resize', handleResize);
            window.removeEventListener('glaze-typing', handleTyping);
            window.removeEventListener('glaze-error', handleError);

			if (sceneRef.current) {
				cancelAnimationFrame(sceneRef.current.animationId);

				// Clean up Three.js objects
				sceneRef.current.scene.traverse((object) => {
					if (object instanceof THREE.Points) {
						object.geometry.dispose();
						if (Array.isArray(object.material)) {
							object.material.forEach((material) => material.dispose());
						} else {
							object.material.dispose();
						}
					}
				});

				sceneRef.current.renderer.dispose();

				if (containerRef.current && sceneRef.current.renderer.domElement) {
					containerRef.current.removeChild(
						sceneRef.current.renderer.domElement,
					);
				}
			}
		};
	}, [theme.id]); // Re-run if theme changes, though mostly stable

	return (
		<div
			ref={containerRef}
			className={cn('pointer-events-none fixed inset-0 -z-0 bg-black', className)} // bg-black ensures dark bg behind dots
			{...props}
		/>
	);
}
