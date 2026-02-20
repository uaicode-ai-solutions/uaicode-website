import { useNavigate } from "react-router-dom";
import { useHeroAuth } from "@/hooks/useHeroAuth";
import { useAuthContext } from "@/contexts/AuthContext";
import { LogOut, User, Home } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import uaicodeLogo from "@/assets/uaicode-logo.png";

const HeroHeader = () => {
  const navigate = useNavigate();
  const { heroUser, isHeroAdmin } = useHeroAuth();
  const { signOut } = useAuthContext();

  const initials = heroUser?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  const handleSignOut = async () => {
    await signOut();
    navigate("/hero");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-black/60 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        <button
          onClick={() => navigate("/hero/home")}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img src={uaicodeLogo} alt="Uaicode" className="h-8 w-auto" />
          <span className="text-lg font-bold text-white">
            Hero<span className="text-uai-500">Ecosystem</span>
          </span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 hover:opacity-80 transition-opacity outline-none">
              <span className="text-sm text-white/70 hidden sm:block">
                {heroUser?.full_name}
              </span>
              <Avatar className="h-9 w-9 border border-white/10">
                <AvatarImage src={heroUser?.avatar_url || undefined} />
                <AvatarFallback className="bg-uai-500/20 text-uai-500 text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-zinc-900 border-white/10 text-white"
          >
            <DropdownMenuItem
              onClick={() => navigate("/hero/home")}
              className="hover:bg-white/5 cursor-pointer"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleSignOut}
              className="hover:bg-white/5 cursor-pointer text-red-400"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default HeroHeader;
