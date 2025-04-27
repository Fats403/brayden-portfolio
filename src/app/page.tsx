"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, SpotLight, PerspectiveCamera } from "@react-three/drei";
import { motion, useScroll } from "framer-motion";
import { Group } from "three";

// Camera controller with stable FOV
const CameraController = ({ scrollProgress }: { scrollProgress: number }) => {
  // Create a stable camera reference
  const cameraRef = useRef(null);
  
  // Limit scroll effect to stop halfway
  const limitedScroll = Math.min(scrollProgress * 2, 1);
  
  // Fixed camera Z position based on scroll
  const cameraZ = 6 - (limitedScroll * 4);
  
  useFrame(() => {
    if (cameraRef.current) {
      // Only update camera position, never FOV
      (cameraRef.current as any).position.z = cameraZ;
    }
  });
  
  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 0, 6]}
      fov={40} // TODO: Make FOV 60 on mobile?
    />
  );
};

// 3D Room component with responsive sizing
const Room = ({ scrollProgress }: { scrollProgress: number }) => {
  const roomRef = useRef<Group>(null);
  const { viewport } = useThree();
  
  // Calculate a stable size multiplier based on viewport width
  // This is memoized so it only recalculates when viewport changes significantly
  const sizeMultiplier = useMemo(() => {
    // Get a value between 0.6 and 1 based on viewport width
    return Math.min(Math.max(viewport.width / 10, 0.6), 1);
  }, [viewport.width]);
  
  // Create properly connected grid with responsive sizing
  const roomLines = useMemo(() => {
    const lines = [];
    const backZ = -5;
    const frontZ = 5;
    const width = 3.5 * sizeMultiplier;
    const height = 2 * sizeMultiplier;
    
    // Create perfectly connected box
    
    // 1. Create the main box structure - outer frame
    const mainBox = [
      // Back wall perimeter
      [[-width, -height, backZ], [width, -height, backZ]],
      [[width, -height, backZ], [width, height, backZ]],
      [[width, height, backZ], [-width, height, backZ]],
      [[-width, height, backZ], [-width, -height, backZ]],
      
      // Front wall perimeter (smaller)
      [[-width*0.3, -height*0.3, frontZ], [width*0.3, -height*0.3, frontZ]],
      [[width*0.3, -height*0.3, frontZ], [width*0.3, height*0.3, frontZ]],
      [[width*0.3, height*0.3, frontZ], [-width*0.3, height*0.3, frontZ]],
      [[-width*0.3, height*0.3, frontZ], [-width*0.3, -height*0.3, frontZ]],
      
      // Connect back to front - corners
      [[-width, -height, backZ], [-width*0.3, -height*0.3, frontZ]],
      [[width, -height, backZ], [width*0.3, -height*0.3, frontZ]],
      [[width, height, backZ], [width*0.3, height*0.3, frontZ]],
      [[-width, height, backZ], [-width*0.3, height*0.3, frontZ]]
    ];
    lines.push(...mainBox);
    
    // 4. Floor grid lines - with perfect connectivity
    const zLines = 2;
    for (let i = 1; i < zLines; i++) {
      const t = i / zLines;
      const z = backZ + t * (frontZ - backZ);
      const widthAtZ = width - t * (width - width*0.3);
      const heightAtZ = height - t * (height - height*0.3);
      
      // Floor horizontal cross-sections (left to right)
      lines.push([[-widthAtZ, -heightAtZ, z], [widthAtZ, -heightAtZ, z]]);
      
      // Ceiling horizontal cross-sections (left to right)
      lines.push([[-widthAtZ, heightAtZ, z], [widthAtZ, heightAtZ, z]]);
      
      // Left wall vertical cross-sections (bottom to top)
      lines.push([[-widthAtZ, -heightAtZ, z], [-widthAtZ, heightAtZ, z]]);
      
      // Right wall vertical cross-sections (bottom to top)
      lines.push([[widthAtZ, -heightAtZ, z], [widthAtZ, heightAtZ, z]]);
    }
    
    return lines;
  }, [sizeMultiplier]);

  // Spotlight position based on size multiplier
  const spotlightPosition = useMemo(() => {
    return {
      left: [-4 * sizeMultiplier, 3 * sizeMultiplier, 0],
      right: [4 * sizeMultiplier, 3 * sizeMultiplier, 0]
    };
  }, [sizeMultiplier]);
  
  // Determine line width based on viewport, but keep it stable
  const lineWidth = useMemo(() => {
    return viewport.width < 5 ? 1.5 : 1;
  }, [viewport.width]);
  
  return (
    <>
      <group ref={roomRef}>
        {/* Room structure with precisely connected grid */}
        {roomLines.map((line, i) => (
          <Line
            key={`line-${i}`}
            points={line as any}
            color="#ffffff"
            lineWidth={lineWidth} 
            opacity={0.18} // Increased opacity for better visibility
            transparent
          />
        ))}
      </group>
      
      {/* Left crossing spotlight with visible beam */}
      <SpotLight
        position={spotlightPosition.left as any}
        angle={1.2}
        penumbra={0.7}
        distance={50}
        intensity={scrollProgress}
        color="#ffffff"
        volumetric
        opacity={scrollProgress}
        attenuation={5}
        anglePower={8}
        castShadow
      />
      
      {/* Right crossing spotlight with visible beam */}
      <SpotLight
        position={spotlightPosition.right as any}
        angle={1.2}
        penumbra={0.7}
        distance={50}
        intensity={scrollProgress}
        color="#ffffff"
        volumetric
        opacity={scrollProgress}
        attenuation={5}
        anglePower={8}
        castShadow
      />
    </>
  );
};

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  
  const [scrollValue, setScrollValue] = useState(0);
  
  // Update scroll value for R3F - use a more stable approach
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      // Use requestAnimationFrame for smoother updates
      requestAnimationFrame(() => {
        setScrollValue(v);
      });
    });
    return () => unsubscribe();
  }, [scrollYProgress]);
  
  // Text scale based on scroll - with limits to prevent extreme scaling
  const textScale = 0.75 + Math.min(scrollValue * 0.2, 0.2); 
  
  // Text opacity based on initial scroll
  const textOpacity = 0.1 + Math.min(scrollValue * 3, 1);
  
  // Calculate circle reveal progress (starting at 0.66 scroll)
  const normalizedCircleProgress = Math.max(0, Math.min(1, (scrollValue - 0.66) * 2.5));
  
  return (
    <div 
      ref={containerRef}
      className="h-[500vh] bg-black"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Canvas style={{ background: 'black' }}>
          <CameraController scrollProgress={scrollValue} />
          <Room scrollProgress={scrollValue} />
        </Canvas>
        
        {/* Full screen white background for masking - covers entire canvas when active */}
        <motion.div
          className="absolute inset-0 bg-white pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: scrollValue > 0.66 ? 1 : 0,
            scale: scrollValue > 0.66 ? normalizedCircleProgress * 10 : 0
          }}
          style={{
            originX: 0.5,
            originY: 0.5,
            borderRadius: normalizedCircleProgress < 0.99 ? '50%' : '0',
            boxShadow: scrollValue > 0.66 ? `0 0 ${40 - normalizedCircleProgress * 20}px ${20 - normalizedCircleProgress * 10}px rgba(255, 255, 255, 0.9)` : 'none',
            filter: 'blur(8px)',
          }}
          transition={{ duration: 0.1 }}
        />
        
        {/* Sharper white circle inside the blurred one for a better core */}
        <motion.div
          className="absolute inset-0 bg-white pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: scrollValue > 0.66 ? 0.9 : 0,
            scale: scrollValue > 0.66 ? normalizedCircleProgress * 9.8 : 0
          }}
          style={{
            originX: 0.5,
            originY: 0.5,
            borderRadius: normalizedCircleProgress < 0.99 ? '50%' : '0',
          }}
          transition={{ duration: 0.1 }}
        />
        
        {/* Text layer that uses mix-blend-mode to invert colors where it overlaps the white circle */}
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mix-blend-difference"
          style={{ 
            opacity: textOpacity,
            scale: textScale,
          }}
        >
          <h1 className="text-2xl md:text-4xl font-light tracking-[0.2em] mb-2 md:mb-4 text-white text-center px-4">
            BRAYDEN BLACKWELL
          </h1>
          
          <p className="text-xs md:text-sm tracking-wider font-light text-center text-white/70 px-4"
             style={{
               opacity: textOpacity > 0.7 ? ((textOpacity - 0.7) * 3) : 0.1,
             }}
          >
            FRONTEND DEVELOPER & DESIGNER
          </p>
        </motion.div>

        {/* Scroll indicator */}
        {scrollValue < 0.1 && (
          <motion.div 
            className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 text-white/40"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <p className="mb-2 text-[10px] md:text-xs uppercase tracking-[0.2em] text-center">Scroll to explore</p>
            <motion.svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.25 }}
            >
              <path 
                d="M12 5L12 19M12 19L19 12M12 19L5 12" 
                stroke="currentColor" 
                strokeWidth="1" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.div>
        )}
        
        {/* Buttons with responsive sizing */}
        <motion.div 
          className="absolute bottom-64 left-1/2 transform -translate-x-1/2 flex gap-2 md:gap-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: scrollValue > 0.4 && scrollValue < 0.62 ? 1 : 0, y: scrollValue > 0.4 && scrollValue < 0.62 ? 0 : 40 }}
          transition={{ duration: 0.5 }}
        >
          <button className="px-4 md:px-8 py-2 bg-white text-black font-light text-[10px] md:text-sm tracking-wider hover:bg-white/90 transition-colors duration-300 whitespace-nowrap">
            VIEW WORK
          </button>
          <button className="px-4 md:px-8 py-2 border border-white text-white font-light text-[10px] md:text-sm tracking-wider hover:bg-white/10 transition-colors duration-300 whitespace-nowrap">
            CONTACT ME
          </button>
        </motion.div>
        
        {/* Vignette overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.5) 100%)',
            opacity: scrollValue > 0.62 ? 1 - normalizedCircleProgress : 1, // Fade out vignette as circle reveals
          }} 
        />
      </div>
    </div>
  );
}
