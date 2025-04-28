"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, SpotLight, PerspectiveCamera } from "@react-three/drei";
import { motion, useScroll } from "framer-motion";
import { Group } from "three";
import { cn } from "@/lib/utils";

// ===== CONFIGURATION =====
// Global settings
const CONFIG = {
  totalScrollHeight: "h-[500vh]",
  sections: {
    room: {
      cameraInitialZ: 6,
      cameraMovementScale: 4,
      cameraFov: 40,
      roomDimensions: {
        backZ: -5,
        frontZ: 5,
        widthMultiplier: 3.5,
        heightMultiplier: 2,
        zLines: 4,
      },
      spotlight: {
        angle: 1.2,
        penumbra: 0.7,
        distance: 50,
        attenuation: 5,
        anglePower: 5,
        widthOffset: 4,
        heightOffset: 3,
      },
      grid: {
        lineOpacity: 0.18,
      }
    },
    introText: {
      name: "BRAYDEN BLACKWELL",
      title: "FRONTEND DEVELOPER & DESIGNER",
      baseScale: 0.75,
      maxScaleIncrease: 0.2,
      baseOpacity: 0.1,
      titleVisibilityThreshold: 0.7,
    },
    actionButtons: {
      appearThreshold: 0.4,
      disappearThreshold: 0.62,
    },
    scrollIndicator: {
      visibilityThreshold: 0.1,
      text: "Scroll to explore",
    },
    circleReveal: {
      startThreshold: 0.66,
      transitionSpeed: 2.5,
      blurredCircle: {
        scale: 10,
        maxBoxShadowBlur: 40,
        minBoxShadowBlur: 20,
        maxSpread: 20,
        minSpread: 10,
      },
      sharpCircle: {
        scale: 9.8,
        opacity: 0.9,
      },
    },
    vignette: {
      gradient: "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.5) 100%)",
    }
  }
};

// Camera controller with stable FOV
const CameraController = ({ scrollProgress, config }) => {
  const cameraRef = useRef(null);
  const limitedScroll = Math.min(scrollProgress * 2, 1);
  
  // Fixed calculation - ensures camera only moves in one direction
  const cameraZ = config.cameraInitialZ - (limitedScroll * config.cameraMovementScale);
  
  useFrame(() => {
    if (cameraRef.current) {
      (cameraRef.current as any).position.z = cameraZ;
    }
  });
  
  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 0, config.cameraInitialZ]}
      fov={config.cameraFov}
    />
  );
};

// 3D Room component with responsive sizing
const Room = ({ scrollProgress, config }) => {
  const roomRef = useRef<Group>(null);
  const { roomDimensions, spotlight, grid } = config;

  const sizeMultiplier = 0.6;
  const lineWidth = 1;
  
  const roomLines = useMemo(() => {
    const lines = [];
    const { backZ, frontZ, widthMultiplier, heightMultiplier, zLines } = roomDimensions;
    const width = widthMultiplier * sizeMultiplier;
    const height = heightMultiplier * sizeMultiplier;
    
    // Main box structure - outer frame
    const mainBox = [
      // Back wall perimeter
      [[-width, -height, backZ], [width, -height, backZ]],
      [[width, -height, backZ], [width, height, backZ]],
      [[width, height, backZ], [-width, height, backZ]],
      [[-width, height, backZ], [-width, -height, backZ]],
      
      // Front wall perimeter (smaller)
      [[-width, -height, frontZ], [width, -height, frontZ]],
      [[width, -height, frontZ], [width, height, frontZ]],
      [[width, height, frontZ], [-width, height, frontZ]],
      [[-width, height, frontZ], [-width, -height, frontZ]],
      
      // Connect back to front - corners
      [[-width, -height, backZ], [-width, -height, frontZ]],
      [[width, -height, backZ], [width, -height, frontZ]],
      [[width, height, backZ], [width, height, frontZ]],
      [[-width, height, backZ], [-width, height, frontZ]]
    ];
    lines.push(...mainBox);
    
    // Floor grid lines - with perfect connectivity
    for (let i = 1; i < zLines; i++) {
      const t = i / zLines;
      const z = backZ + t * (frontZ - backZ);
      const widthAtZ = width - t * (width - width);
      const heightAtZ = height - t * (height - height);
      
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
  }, [sizeMultiplier, roomDimensions]);

  const spotlightPosition = useMemo(() => {
    return {
      left: [-spotlight.widthOffset * sizeMultiplier, spotlight.heightOffset * sizeMultiplier, 0],
      right: [spotlight.widthOffset * sizeMultiplier, spotlight.heightOffset * sizeMultiplier, 0]
    };
  }, [sizeMultiplier, spotlight]);
  
  return (
    <>
      <group ref={roomRef}>
        {roomLines.map((line, i) => (
          <Line
            key={`line-${i}`}
            points={line as any}
            color="#ffffff"
            lineWidth={lineWidth} 
            opacity={grid.lineOpacity}
            transparent
          />
        ))}
      </group>
      
      {/* Left crossing spotlight with visible beam */}
      <SpotLight
        position={spotlightPosition.left as any}
        angle={spotlight.angle}
        penumbra={spotlight.penumbra}
        distance={spotlight.distance}
        intensity={scrollProgress * 0.8}
        color="#ffffff"
        volumetric
        opacity={scrollProgress * 0.4}
        attenuation={spotlight.attenuation}
        anglePower={spotlight.anglePower}
        castShadow
      />
      
      {/* Right crossing spotlight with visible beam */}
      <SpotLight
        position={spotlightPosition.right as any}
        angle={spotlight.angle}
        penumbra={spotlight.penumbra}
        distance={spotlight.distance}
        intensity={scrollProgress * 0.8}
        color="#ffffff"
        volumetric
        opacity={scrollProgress * 0.4}
        attenuation={spotlight.attenuation}
        anglePower={spotlight.anglePower}
        castShadow
      />
    </>
  );
};

// Intro text section with name and title
const IntroText = ({ scrollValue, config }) => {
  const { name, title, baseScale, maxScaleIncrease, baseOpacity, titleVisibilityThreshold } = config;
  
  const textScale = baseScale + Math.min(scrollValue * maxScaleIncrease, maxScaleIncrease);
  const textOpacity = baseOpacity + Math.min(scrollValue * 3, 1);
  const titleOpacity = textOpacity > titleVisibilityThreshold ? 
    ((textOpacity - titleVisibilityThreshold) * 3) : 0.1;

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mix-blend-difference"
      style={{ 
        opacity: textOpacity,
        scale: textScale,
      }}
    >
      <h1 className="text-2xl md:text-4xl font-light tracking-[0.2em] mb-2 md:mb-4 text-white text-center px-4">
        {name}
      </h1>
      
      <p className="text-xs md:text-sm tracking-wider font-light text-center text-white/70 px-4"
         style={{ opacity: titleOpacity }}
      >
        {title}
      </p>
    </motion.div>
  );
};

// Scroll indicator component
const ScrollIndicator = ({ scrollValue, config }) => {
  const { visibilityThreshold, text } = config;
  
  if (scrollValue >= visibilityThreshold) return null;
  
  return (
    <motion.div 
      className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 text-white/40"
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <p className="mb-2 text-[10px] md:text-xs uppercase tracking-[0.2em] text-center">{text}</p>
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
  );
};

// Action buttons component
const ActionButtons = ({ scrollValue, config }) => {
  const { appearThreshold, disappearThreshold } = config;
  const isVisible = scrollValue > appearThreshold && scrollValue < disappearThreshold;
  
  return (
    <motion.div 
      className={`absolute bottom-64 left-1/2 transform -translate-x-1/2 flex gap-2 md:gap-4`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : 40 
      }}
      transition={{ duration: 0.5 }}
    >
      <button className="px-4 md:px-8 py-2 bg-white text-black font-light text-[10px] md:text-sm tracking-wider hover:bg-white/90 transition-colors duration-300 whitespace-nowrap">
        VIEW WORK
      </button>
      <button className="px-4 md:px-8 py-2 border border-white text-white font-light text-[10px] md:text-sm tracking-wider hover:bg-white/10 transition-colors duration-300 whitespace-nowrap">
        CONTACT ME
      </button>
    </motion.div>
  );
};

// Circle reveal component
const CircleReveal = ({ scrollValue, config }) => {
  const { startThreshold, transitionSpeed, blurredCircle, sharpCircle } = config;
  const normalizedCircleProgress = Math.max(0, Math.min(1, (scrollValue - startThreshold) * transitionSpeed));
  const isActive = scrollValue > startThreshold;
  
  return (
    <>
      {/* Full screen white background for masking - covers entire canvas when active */}
      <motion.div
        className="absolute inset-0 bg-white pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isActive ? 1 : 0,
          scale: isActive ? normalizedCircleProgress * blurredCircle.scale : 0
        }}
        style={{
          originX: 0.5,
          originY: 0.5,
          borderRadius: normalizedCircleProgress < 0.99 ? '50%' : '0',
          boxShadow: isActive ? 
            `0 0 ${blurredCircle.maxBoxShadowBlur - normalizedCircleProgress * blurredCircle.minBoxShadowBlur}px ${blurredCircle.maxSpread - normalizedCircleProgress * blurredCircle.minSpread}px rgba(255, 255, 255, 0.9)` : 
            'none',
          filter: 'blur(8px)',
        }}
        transition={{ duration: 0.1 }}
      />
      
      {/* Sharper white circle inside the blurred one for a better core */}
      <motion.div
        className="absolute inset-0 bg-white pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isActive ? sharpCircle.opacity : 0,
          scale: isActive ? normalizedCircleProgress * sharpCircle.scale : 0
        }}
        style={{
          originX: 0.5,
          originY: 0.5,
          borderRadius: normalizedCircleProgress < 0.99 ? '50%' : '0',
        }}
        transition={{ duration: 0.1 }}
      />
    </>
  );
};

// Vignette overlay component
const VignetteOverlay = ({ scrollValue, normalizedCircleProgress, config }) => {
  const { gradient } = config;
  const circleActive = scrollValue > CONFIG.sections.circleReveal.startThreshold;
  
  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{
        background: gradient,
        opacity: circleActive ? 1 - normalizedCircleProgress : 1,
      }} 
    />
  );
};

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  
  const [scrollValue, setScrollValue] = useState<number>(0);
  
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      requestAnimationFrame(() => {
        setScrollValue(v);
      });
    });
    return () => unsubscribe();
  }, [scrollYProgress]);
  
  // Calculate circle reveal progress (starting at config threshold)
  const normalizedCircleProgress = Math.max(0, Math.min(1, 
    (scrollValue - CONFIG.sections.circleReveal.startThreshold) * CONFIG.sections.circleReveal.transitionSpeed
  ));
  
  return (
    <div 
      ref={containerRef}
      className={cn(`${CONFIG.totalScrollHeight}`, 'bg-black')}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Canvas style={{ background: 'black' }}>
          <CameraController 
            scrollProgress={scrollValue} 
            config={CONFIG.sections.room} 
          />
          <Room 
            scrollProgress={scrollValue} 
            config={CONFIG.sections.room} 
          />
        </Canvas>
        
        <CircleReveal 
          scrollValue={scrollValue} 
          config={CONFIG.sections.circleReveal} 
        />
        
        <IntroText 
          scrollValue={scrollValue} 
          config={CONFIG.sections.introText} 
        />

        <ScrollIndicator 
          scrollValue={scrollValue} 
          config={CONFIG.sections.scrollIndicator} 
        />
        
        <ActionButtons 
          scrollValue={scrollValue} 
          config={CONFIG.sections.actionButtons} 
        />
        
        <VignetteOverlay 
          scrollValue={scrollValue} 
          normalizedCircleProgress={normalizedCircleProgress} 
          config={CONFIG.sections.vignette} 
        />
      </div>
    </div>
  );
}
