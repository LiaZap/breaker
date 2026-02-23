import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import logoImg from '../assets/logo.png';

const SplashScreen = ({ onComplete }) => {
  const [imageError, setImageError] = useState(false);
  
  const vectorControls = useAnimation();
  const logoControls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      // 1. Initial State (Set programmatically too)
      vectorControls.set({ x: 0, opacity: 0, scale: 1 });
      logoControls.set({ opacity: 0 });
      
      // 2. ENTER: User defined timing (800ms delay, 600ms duration) - STATIC (No movement)
      await Promise.all([
        vectorControls.start({ 
            opacity: 1, 
            transition: { duration: 0.6, ease: "easeOut", delay: 0.8 } 
        }),
        logoControls.start({ 
            opacity: 1, 
            transition: { duration: 0.6, ease: "easeOut", delay: 0.8 } 
        })
      ]);

      // 3. HOLD: Short readable pause
      await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 seconds hold

      // 4. EXIT PHASE: Concurrent (Vector centers + Logo fades)
      // The user wants the logo to be "much less visible" as the vector moves aside.
      await Promise.all([
        vectorControls.start({
            x: "53.82px",
            transition: { duration: 0.6, ease: "easeInOut" }
        }),
        logoControls.start({ 
            opacity: 0, 
            transition: { duration: 0.4, ease: "easeOut" } // Fades slightly faster than move
        })
      ]);

      // Step C: Vector Zoom/Exit (Final transition)
      vectorControls.set({ zIndex: 50 });
      await vectorControls.start({
          scale: 150, 
          opacity: 0, 
          transition: { duration: 0.8, ease: "easeInOut" }
      });

      // 5. Complete
      if (onComplete) onComplete();
    };

    sequence();
  }, [vectorControls, logoControls, onComplete]);

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden flex flex-col items-center justify-center">
      {/* Content Container - Removed parent opacity animation to avoid double-fade issues */}
      <div className="w-full h-full flex flex-col items-center justify-center relative">
        
        {/* Background Vectors */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
           {/* Abstract glow to mimic the 'Vector 1' lighting effect */}
          <div className="w-[32px] h-[33px] bg-white rounded-full opacity-20 blur-2xl absolute translate-x-[-30px]" />
          <div className="w-[32px] h-[33px] bg-white rounded-full opacity-20 blur-2xl absolute translate-x-[20px]" />
        </div>

        {/* Main Content Group */}
        <div className="relative flex flex-col items-center justify-center w-full h-full">
            <div className="relative flex items-center justify-center gap-[0px]"> {/* Gap 0 as per calculation */}
                {/* Vector 1 (SVG for infinite scaling) */}
                <motion.svg 
                  viewBox="0 0 32 34" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  // User defined timing: 800ms delay, 600ms duration
                  initial={{ x: 0, opacity: 0, scale: 1 }}
                  animate={vectorControls}
                  className="w-[32px] h-[34px] relative z-20"
                >
                  <path d="M7.90383 20.0437H14.6453L13.0697 26.656H0L5.605 0H25.6745L23.7115 6.50905H31.9252L18.5714 33.3975H11.9074L22.0067 13.1214H16.3242L17.8482 6.50905H10.7709L7.90383 20.0437Z" fill="white"/>
                </motion.svg>

                {/* Logo (Mask Group / Ativo 1) */}
                 <motion.div 
                   className="relative z-10 flex items-center justify-center"
                   initial={{ opacity: 0 }}
                   animate={logoControls}
                 >
                     {!imageError ? (
                        <img 
                          src={logoImg} 
                          alt="Breakr" 
                          className="w-[107.79px] h-[38.75px] object-contain"
                          onError={() => setImageError(true)}
                        />
                     ) : (
                        <span className="font-jakarta font-bold text-3xl tracking-tighter text-white">
                          Breakr
                        </span>
                     )}
                </motion.div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
