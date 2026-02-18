import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import logoImg from '../assets/logo.png'; // Assuming the user will provide this

const SplashScreen = () => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-full h-screen bg-[#111111] overflow-hidden flex flex-col items-center justify-center">
      {/* Background Vectors */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
         {/* Abstract glow to mimic the 'Vector 1' lighting effect */}
        <div className="w-[32px] h-[33px] bg-white rounded-full opacity-20 blur-2xl absolute translate-x-[-30px]" />
        <div className="w-[32px] h-[33px] bg-white rounded-full opacity-20 blur-2xl absolute translate-x-[20px]" />
      </div>

      {/* Main Logo Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Logo Container */}
        <div className="flex items-center justify-center mb-4">
             {!imageError ? (
                <img 
                  src={logoImg} 
                  alt="Breaker" 
                  className="h-[40px] w-auto object-contain"
                  onError={() => setImageError(true)}
                />
             ) : (
                <span className="font-jakarta font-bold text-3xl tracking-tighter text-white">
                  Breaker
                </span>
             )}
        </div>
        
        {/* Text: Vamos Começar */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="font-inter font-normal text-[12px] text-white leading-[15px] tracking-wide"
        >
          Vamos Começar
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
