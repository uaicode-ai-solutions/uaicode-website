import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import HeroHeader from "@/components/hero/HeroHeader";
import HeroSidebar from "@/components/hero/HeroSidebar";
import AdminOverview from "@/components/hero/mock/AdminOverview";
import MarketingOverview from "@/components/hero/mock/MarketingOverview";
import SalesOverview from "@/components/hero/mock/SalesOverview";
import HeroProfileForm from "@/components/hero/profile/HeroProfileForm";
import { useHeroAuth } from "@/hooks/useHeroAuth";

const HeroDash = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { canAccessSubsystem } = useHeroAuth();

  const defaultView = (() => {
    if (canAccessSubsystem("admin")) return "admin-overview";
    if (canAccessSubsystem("marketing")) return "mkt-social";
    if (canAccessSubsystem("sales")) return "sales-pipeline";
    return "admin-overview";
  })();

  const [activeItem, setActiveItem] = useState(searchParams.get("view") || defaultView);

  useEffect(() => {
    const view = searchParams.get("view");
    if (view) setActiveItem(view);
  }, [searchParams]);

  const handleItemClick = (id: string) => {
    setActiveItem(id);
    setSearchParams({ view: id });
  };

  const renderContent = () => {
    if (activeItem === "profile") return <HeroProfileForm />;
    if (activeItem.startsWith("admin")) return <AdminOverview view={activeItem} />;
    if (activeItem.startsWith("mkt")) return <MarketingOverview view={activeItem} />;
    if (activeItem.startsWith("sales")) return <SalesOverview view={activeItem} />;
    return <AdminOverview view={activeItem} />;
  };

  return (
    <div className="min-h-screen bg-black">
      <HeroHeader />
      <div className="flex">
        <HeroSidebar activeItem={activeItem} onItemClick={handleItemClick} />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default HeroDash;
