const LpFooter = () => (
  <footer className="relative py-8 px-4 border-t border-border/30">
    <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground/60">
      <span>© {new Date().getFullYear()} Uaicode. All rights reserved.</span>
      <div className="flex items-center gap-6">
        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-muted-foreground transition-colors">
          Privacy Policy
        </a>
        <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover:text-muted-foreground transition-colors">
          Terms of Service
        </a>
      </div>
    </div>
  </footer>
);

export default LpFooter;
