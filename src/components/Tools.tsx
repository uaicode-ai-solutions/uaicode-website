const Tools = () => {
  const tools = [
    "Groq", "LangChain", "LangFlow", "Meta AI", "Microsoft Fabric", "OpenAI",
    "Replicate", "Vertex AI", "Anthropic", "Microsoft Azure", "Azure AI Foundry",
    "Gemini", "Hugging Face"
  ];

  return (
    <section className="py-24 px-4 overflow-hidden bg-card/30">
      <div className="w-full">
        <div className="text-center mb-16 animate-fade-in-up px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Built With the Best <span className="text-gradient-gold">AI Stack</span></h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Enterprise-grade tools from Microsoft, Google, and Meta — now powering your validation and MVP
          </p>
        </div>

        {/* Infinite scroll animation */}
        <div className="relative overflow-hidden">
          <div className="flex gap-8 animate-scroll">
            {[...tools, ...tools, ...tools, ...tools].map((tool, index) => (
              <div 
                key={index}
                className="glass-card px-8 py-4 rounded-lg whitespace-nowrap hover-lift flex-shrink-0 border border-accent/20 transition-all duration-300 hover:border-accent/40 hover:shadow-[0_0_20px_rgba(234,171,8,0.15)]"
              >
                <span className="text-lg font-semibold">{tool}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default Tools;
