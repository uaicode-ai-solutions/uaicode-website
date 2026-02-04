import { useEffect, useState } from "react";
import kyleAvatar from "@/assets/kyle-avatar.webp";

interface KyleAvatarProps {
  isActive?: boolean;
  isSpeaking?: boolean;
  size?: "sm" | "md" | "lg";
}

const KyleAvatar = ({ isActive = false, isSpeaking = false, size = "md" }: KyleAvatarProps) => {
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        setIsPulsing(prev => !prev);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setIsPulsing(false);
    }
  }, [isSpeaking]);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  const glowClasses = {
    sm: "shadow-[0_0_15px_rgba(250,204,21,0.3)]",
    md: "shadow-[0_0_20px_rgba(250,204,21,0.4)]",
    lg: "shadow-[0_0_30px_rgba(250,204,21,0.5)]"
  };

  return (
    <div className="relative">
      {/* Outer glow ring - shows when active */}
      {isActive && (
        <div 
          className={`absolute inset-0 rounded-full bg-gradient-to-r from-accent via-accent/80 to-accent blur-md opacity-40 ${
            isPulsing ? 'scale-110' : 'scale-100'
          } transition-transform duration-500`}
          style={{ margin: '-4px' }}
        />
      )}
      
      {/* Secondary pulse ring for speaking */}
      {isSpeaking && (
        <div 
          className="absolute inset-0 rounded-full border-2 border-accent/50 animate-ping"
          style={{ animationDuration: '1.5s' }}
        />
      )}
      
      {/* Main avatar container */}
      <div 
        className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-2 ${
          isActive 
            ? 'border-accent ' + glowClasses[size]
            : 'border-accent/30'
        } transition-all duration-300`}
      >
        <img 
          src={kyleAvatar}
          alt="Kyle - AI Sales Consultant"
          className="w-full h-full object-cover"
        />
        
        {/* Active overlay glow */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent" />
        )}
      </div>
      
      {/* Status indicator */}
      {isActive && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
          <div className={`w-3 h-3 rounded-full ${
            isSpeaking 
              ? 'bg-accent animate-pulse' 
              : 'bg-green-500'
          } border-2 border-background`} />
        </div>
      )}
    </div>
  );
};

export default KyleAvatar;
