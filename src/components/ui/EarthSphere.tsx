import { useRef, Suspense, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import type { Mesh } from 'three'
import * as THREE from 'three'

// ── Day/Night blend shader ──────────────────────────────────────────────────
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform sampler2D dayTexture;
  uniform sampler2D nightTexture;
  uniform sampler2D specularTexture;
  uniform vec3 sunDirection;
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    float cosAngle = dot(vNormal, normalize(sunDirection));
    float blend = smoothstep(-0.2, 0.2, cosAngle);
    vec4 day   = texture2D(dayTexture, vUv);
    vec4 night = texture2D(nightTexture, vUv);
    vec4 base = mix(night, day, blend);
    gl_FragColor = base;
  }
`

// ── Atmosphere Fresnel shader ───────────────────────────────────────────────
const atmoVert = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const atmoFrag = `
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
    gl_FragColor = vec4(0.2, 0.5, 1.0, 1.0) * intensity;
  }
`

// ── Inner scene components ──────────────────────────────────────────────────
function EarthMesh({ sunDirRef }: { sunDirRef: React.MutableRefObject<THREE.Vector3> }) {
  const earthRef = useRef<Mesh>(null)
  const cloudsRef = useRef<Mesh>(null)

  const [dayMap, nightMap, normalMap, specularMap, cloudsMap] = useLoader(TextureLoader, [
    '/textures/earth_day.jpg',
    '/textures/earth_night.png',
    '/textures/earth_normal.jpg',
    '/textures/earth_specular.jpg',
    '/textures/earth_clouds.png',
  ])

  // Assign anisotropy for sharper textures
  ;[dayMap, nightMap, normalMap, specularMap, cloudsMap].forEach(t => {
    t.anisotropy = 8
  })

  const uniforms = useMemo(() => ({
    dayTexture:      { value: dayMap },
    nightTexture:    { value: nightMap },
    specularTexture: { value: specularMap },
    sunDirection:    { value: sunDirRef.current },
  }), [dayMap, nightMap, specularMap, sunDirRef])

  useFrame((_state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.08
      // Update shader uniform from ref
      const shaderMat = earthRef.current.material as THREE.ShaderMaterial
      if (shaderMat && shaderMat.uniforms) {
        shaderMat.uniforms.sunDirection.value = sunDirRef.current
      }
    }
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.10
  })

  // normalMap used by loader; satisfies noUnusedLocals
  void normalMap

  return (
    <>
      {/* Earth – day/night shader */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>

      {/* Clouds */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.005, 64, 64]} />
        <meshPhongMaterial
          map={cloudsMap}
          alphaMap={cloudsMap}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </mesh>
    </>
  )
}

function StarField() {
  const count = 1600
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 8 + Math.random() * 3
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#ffffff" transparent opacity={0.75} />
    </points>
  )
}

function FallbackSphere() {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="#0d4a72" />
    </mesh>
  )
}

// ── Public component ────────────────────────────────────────────────────────
export default function EarthSphere({
  size = 340,
  sunDirRef,
}: {
  size?: number
  sunDirRef?: React.MutableRefObject<THREE.Vector3>
}) {
  const internalSunDirRef = useRef(new THREE.Vector3(1.5, 0.5, 1.0).normalize())
  const activeSunDirRef = sunDirRef || internalSunDirRef
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      // Get position relative to viewport and amplify for extreme sensitivity
      const nx = ((e.clientX / window.innerWidth) * 2 - 1) * 6.5
      const ny = ((e.clientY / window.innerHeight) * 2 - 1) * 6.5

      // Update sun direction in place (don't create new Vector3)
      // z is very small so shadow extends far across the globe
      activeSunDirRef.current.set(nx, -ny, 0.15).normalize()
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [activeSunDirRef])

  return (
    <div ref={containerRef} style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 2.6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.04} />
        <StarField />
        <Suspense fallback={<FallbackSphere />}>
          <EarthMesh sunDirRef={activeSunDirRef} />
        </Suspense>
      </Canvas>
    </div>
  )
}
