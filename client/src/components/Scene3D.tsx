import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import {
  PerspectiveCamera,
  Stars,
  Environment,
  Float,
  PresentationControls,
  Html,
} from "@react-three/drei";
import * as THREE from "three";
import { AlertCircle } from "lucide-react";

function ErrorFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0b] text-primary p-4 text-center z-20">
      <AlertCircle className="w-12 h-12 mb-4 animate-pulse" />
      <h2 className="text-xl font-display font-bold mb-2 tracking-tighter">
        ENGINE_OFFLINE
      </h2>
      <p className="text-sm text-muted-foreground max-w-xs font-mono">
        WebGL initialization failed. Switching to static background.
      </p>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-20" />
    </div>
  );
}

class SceneErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return <ErrorFallback />;
    return this.props.children;
  }
}

import { useTheme } from "./theme-provider";

function Robot({ orientation, ...props }: any) {
  const { theme } = useTheme();
  const group = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const [emotion, setEmotion] = useState<
    "neutral" | "happy" | "heart" | "angry"
  >("neutral");
  const [isWaving, setIsWaving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const emotionInterval = setInterval(
      () => {
        if (!isWaving && !isHovered) {
          const emotions: Array<"neutral" | "happy" | "heart" | "angry"> = [
            "neutral",
            "happy",
            "heart",
            "angry",
          ];
          const randomEmotion =
            emotions[Math.floor(Math.random() * emotions.length)];
          setEmotion(randomEmotion);
        }
      },
      Math.random() * 2000 + 1000,
    ); // Random time between 1 and 3 seconds

    return () => clearInterval(emotionInterval);
  }, [isWaving, isHovered]);

  useEffect(() => {
    if (isWaving || isHovered) {
      setEmotion("happy");
    }

    if (isWaving) {
      const timer = setTimeout(() => {
        setIsWaving(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isWaving, isHovered]);

  const currentEmotion = emotion;

  const [speechText, setSpeechText] = useState("");
  const speechTimerRef = useRef<NodeJS.Timeout | null>(null);
  // 🔁 Speech sequence (NO repeat on hover)
  const messages = ["HI_USER", "WELCOME_TO_MY_PORTFOLIO", "I_AM_SUBHAM"];
  const messageIndexRef = useRef(0);

  useEffect(() => {
    if ((isWaving || isHovered) && !speechText) {
      // 🔢 Get next message in sequence
      const msg = messages[messageIndexRef.current];
      setSpeechText(msg);

      // ➡️ Move to next message (loop after last)
      messageIndexRef.current = (messageIndexRef.current + 1) % messages.length;

      // 🔊 Web Speech API
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(
          msg.replace(/_/g, " ").toLowerCase(),
        );

        const voices = window.speechSynthesis.getVoices();
        const priorities = [
          "Google UK English Male",
          "Google US English",
          "Microsoft Zira",
          "Samantha",
          "Robot",
        ];

        const selectedVoice = voices.find((v) =>
          priorities.some((p) => v.name.includes(p)),
        );

        if (selectedVoice) utterance.voice = selectedVoice;

        utterance.pitch = 0.7;
        utterance.rate = 0.85;
        utterance.volume = 0.7;

        window.speechSynthesis.speak(utterance);
      }

      // ⏱ Auto clear text
      speechTimerRef.current = setTimeout(() => {
        setSpeechText("");
        speechTimerRef.current = null;
      }, 2000);
    }
  }, [isWaving, isHovered, speechText]);

  useFrame((state) => {
    if (!group.current || !headRef.current || !rightArmRef.current) return;

    // Head tracking logic
    let mouseX = state.mouse.x;
    let mouseY = state.mouse.y;

    // Look at center when waving or hovered
    if (isWaving || isHovered) {
      mouseX = 0;
      mouseY = 0;
    } else {
      // Add tilt tracking for mobile when not waving/hovered
      if (Math.abs(mouseX) < 0.01 && Math.abs(mouseY) < 0.01) {
        mouseX = orientation.gamma;
        mouseY = -orientation.beta;
      }
    }

    const targetRotationY = mouseX * (Math.PI / 2.5);
    const targetRotationX = -mouseY * (Math.PI / 3.5);

    headRef.current.rotation.x = THREE.MathUtils.lerp(
      headRef.current.rotation.x,
      targetRotationX,
      0.1,
    );
    headRef.current.rotation.y = THREE.MathUtils.lerp(
      headRef.current.rotation.y,
      targetRotationY,
      0.1,
    );

    const targetRotationZ = mouseX * -0.15;
    headRef.current.rotation.z = THREE.MathUtils.lerp(
      headRef.current.rotation.z,
      targetRotationZ,
      0.08,
    );

    // Waving animation logic
    if (isWaving || isHovered) {
      // Waving "Hello" - Pivot from shoulder, move hand/fingers upward
      const t = state.clock.elapsedTime * 10;
      const waveRotation = Math.sin(t) * 0.3; // Sideways wave motion

      // Lift arm to shoulder height (pivot point)
      rightArmRef.current.position.y = THREE.MathUtils.lerp(
        rightArmRef.current.position.y,
        0.4,
        0.15,
      );
      rightArmRef.current.position.x = THREE.MathUtils.lerp(
        rightArmRef.current.position.x,
        0.85,
        0.15,
      );

      // Pivot from shoulder: Point arm mostly UP (around -PI/1.2) and add wave motion to the end
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
        rightArmRef.current.rotation.z,
        -Math.PI / 1.1 + waveRotation,
        0.15,
      );
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
        rightArmRef.current.rotation.x,
        0.4,
        0.15,
      );
      rightArmRef.current.rotation.y = THREE.MathUtils.lerp(
        rightArmRef.current.rotation.y,
        -0.2,
        0.15,
      );
    } else {
      // Resting position
      rightArmRef.current.position.y = THREE.MathUtils.lerp(
        rightArmRef.current.position.y,
        -0.15,
        0.1,
      );
      rightArmRef.current.position.x = THREE.MathUtils.lerp(
        rightArmRef.current.position.x,
        0.9,
        0.1,
      ); // Closer but detached
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
        rightArmRef.current.rotation.z,
        -Math.PI / 3.5,
        0.1,
      );
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
        rightArmRef.current.rotation.x,
        0,
        0.1,
      );
      rightArmRef.current.rotation.y = THREE.MathUtils.lerp(
        rightArmRef.current.rotation.y,
        0,
        0.1,
      );
    }

    // Left arm floating resting position
    if (leftArmRef.current) {
      leftArmRef.current.position.y = THREE.MathUtils.lerp(
        leftArmRef.current.position.y,
        -0.15,
        0.1,
      );
      leftArmRef.current.position.x = THREE.MathUtils.lerp(
        leftArmRef.current.position.x,
        -0.9,
        0.1,
      ); // Closer but detached
      leftArmRef.current.rotation.z = THREE.MathUtils.lerp(
        leftArmRef.current.rotation.z,
        Math.PI / 3.5,
        0.1,
      );
    }

    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
  });

  const triggerInteraction = (e: any) => {
    e.stopPropagation();
    setIsWaving(true);
  };

  const onPointerOver = (e: any) => {
    e.stopPropagation();
    setIsHovered(true);
  };

  const onPointerOut = (e: any) => {
    e.stopPropagation();
    setIsHovered(false);
  };

  const robotColor = "#2a2418"; // Dark amber-tinted metal for dark mode
  const jointColor = "#4a3f2a"; // Bronze joints
  const visorColor = "#0a0a0a";
  const accentLightColor = "#2dd4bf"; // Subtle teal accent lights
  const eyeColor = "#ffffff"; // White eyes as requested
  const heartColor = "#ffffff"; // White as requested
  const angryColor = "#ffffff"; // White as requested

  return (
    <group ref={group} {...props} dispose={null}>
      {/* Invisible interaction sphere to catch all hover events in the robot area */}
      <mesh
        position={[0, 0, 0]}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setIsHovered(true);
        }}
        onPointerLeave={(e) => {
          e.stopPropagation();
          setIsHovered(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          setIsWaving(true);
        }}
      >
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Body / Torso - Modernized Tapered Egg Shape from Image */}
      <mesh position={[0, -0.4, 0]} scale={[1, 1.25, 1]}>
        <sphereGeometry args={[0.65, 64, 64]} />
        <meshStandardMaterial
          color={robotColor}
          roughness={0.4}
          metalness={0.1}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Subtle Panel Seams on Body */}
      <mesh position={[0, -0.4, 0]} scale={[1.005, 1.255, 1.005]}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial
          color={jointColor}
          wireframe
          opacity={0.1}
          transparent
        />
      </mesh>

      {/* Arms - Floating Capsules with Metal Joints */}
      <group
        ref={leftArmRef}
        position={[-0.8, -0.15, 0.1]}
        rotation={[0, 0, Math.PI / 3.5]}
      >
        <mesh>
          <capsuleGeometry args={[0.1, 0.35, 8, 32]} />
          <meshStandardMaterial
            color={robotColor}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color={jointColor}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      <group
        ref={rightArmRef}
        position={[0.8, -0.15, 0.1]}
        rotation={[0, 0, -Math.PI / 3.5]}
      >
        <mesh>
          <capsuleGeometry args={[0.1, 0.35, 8, 32]} />
          <meshStandardMaterial
            color={robotColor}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color={jointColor}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Neck / Connector - Brushed Metal */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.15, 32]} />
        <meshStandardMaterial
          color={jointColor}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Head Group */}
      <group ref={headRef} position={[0, 0.85, 0]}>
        {/* Main Head Shape - Smooth Rounded Ceramic */}
        <mesh scale={[1.3, 1, 0.95]}>
          <sphereGeometry args={[0.58, 64, 64]} />
          <meshStandardMaterial
            color={robotColor}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>

        {/* Face Visor / Plate - Ultra-Glossy Glass Finish */}
        <mesh position={[0, 0, 0.42]} scale={[1, 0.72, 0.18]}>
          <sphereGeometry args={[0.55, 64, 64]} />
          <meshPhysicalMaterial
            color="#050505"
            roughness={0}
            metalness={1}
            transmission={0}
            thickness={0.5}
            clearcoat={1}
            clearcoatRoughness={0}
            reflectivity={1}
            envMapIntensity={3}
            transparent={false}
            depthWrite={true}
            depthTest={true}
          />
        </mesh>

        {/* Subtle Teal Accent Lights on Head sides */}
        <mesh position={[-0.65, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <ringGeometry args={[0.05, 0.07, 32]} />
          <meshBasicMaterial
            color={accentLightColor}
            transparent
            opacity={0.6}
          />
        </mesh>
        <mesh position={[0.65, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[0.05, 0.07, 32]} />
          <meshBasicMaterial
            color={accentLightColor}
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* Emotions Rendering - Using renderOrder to ensure it's on top */}
        <group position={[0, 0, 0.53]}>
          {currentEmotion === "neutral" && (
            <>
              <mesh position={[-0.15, 0.05, 0]} renderOrder={999}>
                <capsuleGeometry args={[0.02, 0.08, 4, 8]} />
                <meshBasicMaterial
                  color={eyeColor}
                  depthTest={false}
                  transparent={true}
                />
              </mesh>
              <mesh position={[0.15, 0.05, 0]} renderOrder={999}>
                <capsuleGeometry args={[0.02, 0.08, 4, 8]} />
                <meshBasicMaterial
                  color={eyeColor}
                  depthTest={false}
                  transparent={true}
                />
              </mesh>
            </>
          )}

          {currentEmotion === "happy" && (
            <>
              <mesh
                position={[-0.15, 0.05, 0]}
                rotation={[0, 0, -Math.PI / 4]}
                renderOrder={999}
              >
                <torusGeometry args={[0.06, 0.015, 8, 16, Math.PI]} />
                <meshBasicMaterial
                  color={eyeColor}
                  depthTest={false}
                  transparent={true}
                />
              </mesh>
              <mesh
                position={[0.15, 0.05, 0]}
                rotation={[0, 0, -Math.PI / 4]}
                renderOrder={999}
              >
                <torusGeometry args={[0.06, 0.015, 8, 16, Math.PI]} />
                <meshBasicMaterial
                  color={eyeColor}
                  depthTest={false}
                  transparent={true}
                />
              </mesh>
              <mesh
                position={[0, -0.1, 0]}
                rotation={[Math.PI, 0, 0]}
                renderOrder={999}
              >
                <torusGeometry args={[0.04, 0.01, 8, 16, Math.PI]} />
                <meshBasicMaterial
                  color={eyeColor}
                  depthTest={false}
                  transparent={true}
                />
              </mesh>
            </>
          )}

          {currentEmotion === "heart" && (
            <>
              <mesh position={[-0.15, 0.05, 0]} renderOrder={999}>
                <torusGeometry args={[0.06, 0.015, 16, 32]} />
                <meshBasicMaterial
                  color={eyeColor}
                  depthTest={false}
                  transparent={true}
                />
              </mesh>
              <mesh position={[-0.15, 0.05, 0]} renderOrder={999}>
                <sphereGeometry args={[0.02, 16, 16]} />
                <meshBasicMaterial
                  color={eyeColor}
                  depthTest={false}
                  transparent={true}
                />
              </mesh>
              <mesh position={[0.15, 0.05, 0]} renderOrder={999}>
                <torusGeometry args={[0.06, 0.015, 16, 32]} />
                <meshBasicMaterial
                  color={eyeColor}
                  depthTest={false}
                  transparent={true}
                />
              </mesh>
              <mesh position={[0.15, 0.05, 0]} renderOrder={999}>
                <sphereGeometry args={[0.02, 16, 16]} />
                <meshBasicMaterial
                  color={eyeColor}
                  depthTest={false}
                  transparent={true}
                />
              </mesh>
            </>
          )}

          {currentEmotion === "angry" && (
            <>
              <mesh position={[-0.15, 0.05, 0]} renderOrder={999}>
                <boxGeometry args={[0.12, 0.02, 0.01]} />
                <meshBasicMaterial
                  color={eyeColor}
                  depthTest={false}
                  transparent={true}
                />
              </mesh>
              <mesh position={[0.15, 0.05, 0]} renderOrder={999}>
                <boxGeometry args={[0.12, 0.02, 0.01]} />
                <meshBasicMaterial
                  color={eyeColor}
                  depthTest={false}
                  transparent={true}
                />
              </mesh>
            </>
          )}
        </group>
      </group>

      <pointLight
        position={[0, 2, 2]}
        intensity={0.8}
        color={accentLightColor}
      />
      <spotLight
        position={[0, 5, 5]}
        intensity={1}
        color="#ffffff"
        angle={0.5}
        penumbra={1}
        castShadow
      />
      <pointLight position={[2, 1, -1]} intensity={0.5} color={jointColor} />

      {/* Speech Bubble */}
      <AnimatePresence>
        {speechText && (
          <Html position={[0, 1.6, 0]} center distanceFactor={10}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative group"
            >
              {/* Glossy Cyber Bubble */}
              <div className="bg-black/80 backdrop-blur-xl text-cyan-400 px-4 py-1.5 rounded-lg font-mono text-[10px] font-bold tracking-[0.2em] whitespace-nowrap border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)] relative z-10 overflow-hidden">
                {/* Scanline effect inside bubble */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-full w-full animate-scanline pointer-events-none" />

                <div className="relative z-10 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                  {speechText}
                </div>
              </div>

              {/* Bubble Tail */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black/80 border-r border-b border-cyan-500/50 rotate-45 z-0 shadow-[4px_4px_10px_rgba(0,0,0,0.5)]" />
            </motion.div>
          </Html>
        )}
      </AnimatePresence>
    </group>
  );
}

function Rig({
  orientation,
  isMobile,
  isLandscape,
}: {
  orientation: { beta: number; gamma: number };
  isMobile: boolean;
  isLandscape: boolean;
}) {
  useFrame((state) => {
    let targetX = 2 + state.mouse.x;
    let targetY = 1 + state.mouse.y;

    if (
      isMobile &&
      Math.abs(state.mouse.x) < 0.01 &&
      Math.abs(state.mouse.y) < 0.01
    ) {
      if (isLandscape) {
        // In landscape: beta becomes horizontal tilt, gamma becomes vertical tilt
        targetX = 2 + orientation.beta * 0.5;
        targetY = 1 + orientation.gamma * 0.5;
      } else {
        targetX = 2 + orientation.gamma * 0.5;
        targetY = 1 - orientation.beta * 0.5;
      }
    }

    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      targetX,
      0.05,
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      targetY,
      0.05,
    );
    state.camera.lookAt(0, 0.5, 0);
  });
  return null;
}

function EllipticalPlanet({
  a,
  b,
  speed,
  size,
  color,
  tilt = 0,
  hasRing = false,
  hasMoon = false,
}: {
  a: number;
  b: number;
  speed: number;
  size: number;
  color: string;
  tilt?: number;
  hasRing?: boolean;
  hasMoon?: boolean;
}) {
  const planet = useRef<THREE.Group>(null);
  const moon = useRef<THREE.Mesh>(null);
  const angle = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    angle.current += speed * delta;

    if (!planet.current) return;

    planet.current.position.set(
      Math.cos(angle.current) * a,
      0,
      Math.sin(angle.current) * b,
    );

    planet.current.rotation.y += delta * 0.5;

    if (moon.current) {
      moon.current.position.set(
        Math.cos(angle.current * 4) * 0.25,
        0,
        Math.sin(angle.current * 4) * 0.25,
      );
    }
  });

  return (
    <group rotation={[tilt, 0, 0]}>
      {/* Orbit path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[a - 0.01, a + 0.01, 160]} />
        <meshBasicMaterial
          color="#475569"
          transparent
          opacity={0.1}
          depthWrite={false}
        />
      </mesh>

      <group ref={planet}>
        {/* Planet */}
        <mesh>
          <sphereGeometry args={[size, 48, 48]} />
          <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
        </mesh>

        {/* Saturn Ring */}
        {hasRing && (
          <mesh rotation={[Math.PI / 2.4, 0, 0]}>
            <ringGeometry args={[size * 1.4, size * 2.2, 64]} />
            <meshStandardMaterial
              color="#cbd5f5"
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {/* Moon */}
        {hasMoon && (
          <mesh ref={moon}>
            <sphereGeometry args={[size * 0.25, 24, 24]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.8} />
          </mesh>
        )}
      </group>
    </group>
  );
}

function RealisticSolarSystem() {
  return (
    <group position={[-1.0, 1.5, -4.5]}>
      {/* Star */}
      <mesh>
        <sphereGeometry args={[0.45, 64, 64]} />
        <meshStandardMaterial
          color="#fff7ed"
          emissive="#fde047"
          emissiveIntensity={20}
        />
      </mesh>

      <pointLight intensity={20} distance={18} color="#fde047" />

      {/* Inner rocky planets */}
      {/* Planet 1 - Mercury-like */}
      <EllipticalPlanet
        a={1}
        b={0.8}
        speed={1.6}
        size={0.06}
        color="#9ca3af"
        tilt={0.1}
      />

      {/* Planet 2 - Venus-like */}
      <EllipticalPlanet
        a={1.4}
        b={1.2}
        speed={1.3}
        size={0.085}
        color="#fbbf24"
        tilt={0.05}
      />

      {/* Planet 3 - Earth-like */}
      <EllipticalPlanet
        a={1.8}
        b={1.5}
        speed={1.1}
        size={0.09}
        color="#38bdf8"
        tilt={0.08}
        hasMoon
      />

      {/* Planet 4 - Mars-like */}
      <EllipticalPlanet
        a={2.2}
        b={1.9}
        speed={0.9}
        size={0.075}
        color="#ef4444"
        tilt={0.15}
      />

      {/* Planet 5 - Jupiter-like gas giant */}
      <EllipticalPlanet
        a={2.8}
        b={2.4}
        speed={0.7}
        size={0.18}
        color="#f59e0b"
        tilt={0.25}
      />

      {/* Planet 6 - Saturn-like with rings */}
      <EllipticalPlanet
        a={3.4}
        b={2.9}
        speed={0.55}
        size={0.16}
        color="#fde047"
        tilt={0.35}
        hasRing
      />

      {/* Planet 7 - Uranus-like ice giant with rings */}
      <EllipticalPlanet
        a={4.0}
        b={3.4}
        speed={0.4}
        size={0.13}
        color="#06b6d4"
        tilt={0.45}
        hasRing
      />

      {/* Planet 8 - Neptune-like */}
      <EllipticalPlanet
        a={4.6}
        b={3.9}
        speed={0.3}
        size={0.12}
        color="#3b82f6"
        tilt={0.3}
        hasMoon
      />
    </group>
  );
}

export function Scene3D() {
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [orientation, setOrientation] = useState({ beta: 0, gamma: 0 });
  const [webglError, setWebglError] = useState(false);

  useEffect(() => {
    const checkLayout = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobileDevice = width < 768;
      setIsMobile(isMobileDevice);
      // Landscape detection: width > height AND is mobile AND short height
      setIsLandscape(isMobileDevice && width > height && height < 500);
    };
    checkLayout();
    window.addEventListener("resize", checkLayout);

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        setOrientation({
          beta: THREE.MathUtils.clamp(e.beta, -30, 30) / 30,
          gamma: THREE.MathUtils.clamp(e.gamma, -30, 30) / 30,
        });
      }
    };
    window.addEventListener("deviceorientation", handleOrientation);

    return () => {
      window.removeEventListener("resize", checkLayout);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  if (webglError) return <ErrorFallback />;

  // Responsive positioning for different orientations
  // Responsive positioning for different orientations
  // Responsive positioning for different orientations
  const width = typeof window !== "undefined" ? window.innerWidth : 1920;
  const height = typeof window !== "undefined" ? window.innerHeight : 1080;

  let robotPosition: [number, number, number] = [1.9, -0.5, 0];
  let robotScale = 1.2;
  let cameraZ = 5;

  if (isMobile) {
    if (isLandscape) {
      // Landscape mobile: scale based on height
      robotScale = Math.max(0.6, Math.min(1.0, height / 500));
      robotPosition = [2.2, -0.8, 0];
      cameraZ = 4.5;
    } else {
      // Portrait mobile: scale based on width
      robotScale = Math.max(0.7, Math.min(1.1, width / 450));
      robotPosition = [0, -0.8, 0];
      cameraZ = 7;
    }
  } else if (width < 1024) {
    // Tablet
    robotScale = Math.max(0.9, Math.min(1.3, width / 800));
    robotPosition = [1.5, -0.6, 0];
    cameraZ = 5.5;
  } else {
    // Desktop: scale based on width for ultrawide support
    robotScale = Math.max(1.0, Math.min(1.5, width / 1400));
  }

  const bgColor = "#0a0a0b";
  const fogColor = "#0a0a0b";

  return (
    <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#020205] via-[#050510] to-[#020205]">
      <SceneErrorBoundary>
        <Canvas
          shadows
          dpr={[1, 2]}
          onCreated={({ gl }) => {
            if (!gl) setWebglError(true);
          }}
          onError={() => setWebglError(true)}
        >
          <Suspense fallback={null}>
            <PerspectiveCamera
              makeDefault
              position={[0, 1, cameraZ]}
              fov={50}
            />
            <ambientLight intensity={0.4} />

            {/* Cosmic Radiation / Rim Lighting from right */}
            <spotLight
              position={[5, 2, 2]}
              angle={0.5}
              penumbra={1}
              intensity={3.5}
              color="#6366f1"
              castShadow={false}
            />

            <spotLight
              position={[10, 10, 10]}
              angle={0.15}
              penumbra={1}
              intensity={1}
              castShadow
              color="#ffffff"
            />
            <pointLight
              position={[-10, -10, -10]}
              intensity={0.5}
              color="#ffffff"
            />

            <Stars
              radius={100}
              depth={50}
              count={3000}
              factor={4}
              saturation={0}
              fade
              speed={1}
            />

            <RealisticSolarSystem />

            <PresentationControls
              global
              config={{ mass: 2, tension: 500 }}
              snap={{ mass: 4, tension: 1500 }}
              rotation={[0, 0, 0]}
              polar={[-Math.PI / 3, Math.PI / 3]}
              azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
            >
              <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                <Robot
                  position={robotPosition}
                  scale={robotScale}
                  orientation={orientation}
                />
              </Float>
            </PresentationControls>

            <Rig
              orientation={orientation}
              isMobile={isMobile}
              isLandscape={isLandscape}
            />

            {/* Environment for reflections */}
            <Environment preset={theme === "dark" ? "night" : "apartment"} />

            <fog attach="fog" args={[fogColor, 5, 15]} />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
      {!webglError && (
        <div className="absolute inset-0 z-10 pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>
      )}
    </div>
  );
}
