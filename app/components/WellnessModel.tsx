"use client"

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Torus, Box } from '@react-three/drei';
import * as THREE from 'three';

export default function WellnessModel() {
    const groupRef = useRef<THREE.Group>(null);
    const sphereRef = useRef<THREE.Mesh>(null);
    const torusRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.2;
        }
        if (sphereRef.current) {
            sphereRef.current.rotation.x += delta * 0.3;
            sphereRef.current.rotation.y += delta * 0.2;
        }
        if (torusRef.current) {
            torusRef.current.rotation.x += delta * 0.2;
            torusRef.current.rotation.z += delta * 0.3;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Center Sphere */}
            <Sphere ref={sphereRef} args={[1, 32, 32]} position={[0, 0, 0]}>
                <meshStandardMaterial
                    color="#6366f1"
                    roughness={0.2}
                    metalness={0.8}
                    envMapIntensity={0.8}
                />
            </Sphere>

            {/* Orbiting Torus */}
            <Torus ref={torusRef} args={[2, 0.2, 16, 32]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial
                    color="#8b5cf6"
                    roughness={0.2}
                    metalness={0.8}
                    envMapIntensity={0.8}
                />
            </Torus>

            {/* Floating Particles */}
            {[...Array(12)].map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const radius = 3;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                const y = Math.sin(i * 0.5) * 0.5;

                return (
                    <Box
                        key={i}
                        args={[0.2, 0.2, 0.2]}
                        position={[x, y, z]}
                    >
                        <meshStandardMaterial
                            color="#a855f7"
                            emissive="#a855f7"
                            emissiveIntensity={0.2}
                            roughness={0.2}
                            metalness={0.8}
                        />
                    </Box>
                );
            })}
        </group>
    );
} 