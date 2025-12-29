import { useState, useEffect } from "react";
import eveAvatarImage from "@/assets/eve-avatar.webp";

interface EveAvatarProps {
  isActive?: boolean;
  isSpeaking?: boolean;
  size?: "sm" | "md" | "lg";
}

const EveAvatar = ({ isActive = false, isSpeaking = false, size = "md" }: EveAvatarProps) => {
  const [pulseRing, setPulseRing] = useState(false);

  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        setPulseRing(prev => !prev);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isSpeaking]);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className="relative">
      {/* Outer glow ring */}
      <div 
        className={`absolute inset-0 rounded-full bg-gradient-to-r from-accent via-accent/80 to-accent transition-all duration-500 ${
          isActive ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
        } ${isSpeaking ? 'animate-pulse' : ''}`}
        style={{ filter: 'blur(8px)' }}
      />
      
      {/* Secondary pulse ring when speaking */}
      {isSpeaking && (
        <div 
          className={`absolute inset-0 rounded-full border-2 border-accent/50 transition-all duration-300 ${
            pulseRing ? 'scale-150 opacity-0' : 'scale-100 opacity-50'
          }`}
        />
      )}
      
      {/* Main avatar container */}
      <div 
        className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-2 transition-all duration-300 ${
          isActive 
            ? 'border-accent shadow-[0_0_20px_rgba(250,204,21,0.4)]' 
            : 'border-border'
        }`}
      >
        {/* Avatar image */}
        <img 
          src={eveAvatarImage} 
          alt="Eve - Assistente Virtual"
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isSpeaking ? 'scale-105' : 'scale-100'
          }`}
        />
        
        {/* Overlay gradient when active */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5 pointer-events-none" />
        )}
      </div>
      
      {/* Status indicator */}
      <div 
        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background transition-all duration-300 ${
          isActive 
            ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' 
            : 'bg-green-500'
        } ${isActive ? 'animate-pulse' : ''}`}
      />
    </div>
  );
};

export default EveAvatar;
