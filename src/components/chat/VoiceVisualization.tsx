interface VoiceVisualizationProps {
  frequencyBars: number[];
  isSpeaking: boolean;
}

const VoiceVisualization = ({ frequencyBars, isSpeaking }: VoiceVisualizationProps) => {
  return (
    <div className="px-4 py-4 border-t border-border bg-gradient-to-b from-secondary/50 to-secondary/30">
      <div className="flex items-end justify-center gap-1 h-14">
        {frequencyBars.map((height, i) => (
          <div
            key={i}
            className="w-2 rounded-full transition-all duration-75 ease-out"
            style={{
              height: `${Math.max(height * 100, 12)}%`,
              background: isSpeaking 
                ? `linear-gradient(to top, hsl(var(--accent)), hsl(var(--accent) / 0.6))` 
                : `linear-gradient(to top, hsl(var(--muted-foreground)), hsl(var(--muted-foreground) / 0.4))`,
              opacity: height > 0.2 ? 1 : 0.5,
              boxShadow: height > 0.5 && isSpeaking 
                ? '0 0 10px hsla(var(--accent) / 0.4)' 
                : 'none',
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 mt-3">
        <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-accent' : 'bg-green-500'} animate-pulse`} />
        <p className="text-sm text-muted-foreground">
          {isSpeaking ? "Eve está falando..." : "Ouvindo..."}
        </p>
      </div>
    </div>
  );
};

export default VoiceVisualization;
