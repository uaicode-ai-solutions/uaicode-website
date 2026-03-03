import { Link } from "react-router-dom";

const LpFooter = () => (
  <footer className="relative py-8 px-4 border-t border-border/30">
    <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground/60">
      <span>© 2025 Uaicode. All rights reserved.</span>
      <div className="flex items-center gap-6">
        <Link to="/privacy" className="hover:text-muted-foreground transition-colors">
          Privacy Policy
        </Link>
        <Link to="/terms" className="hover:text-muted-foreground transition-colors">
          Terms of Service
        </Link>
      </div>
    </div>
  </footer>
);

export default LpFooter;
