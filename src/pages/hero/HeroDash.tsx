import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import HeroHeader from "@/components/hero/HeroHeader";
import HeroSidebar from "@/components/hero/HeroSidebar";
import HeroUserManagement from "@/components/hero/admin/HeroUserManagement";
import SocialMediaOverview from "@/components/hero/mock/SocialMediaOverview";
import LeadManagement from "@/components/hero/mock/LeadManagement";
import PlanningMySaasOverview from "@/components/hero/mock/PlanningMySaasOverview";
import { useHeroAuth } from "@/hooks/useHeroAuth";

const HeroDash = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { canAccessSubsystem } = useHeroAuth();

  const defaultView = (() => {
    if (canAccessSubsystem("admin")) return "admin-users";
    if (canAccessSubsystem("marketing")) return "mkt-social";
    if (canAccessSubsystem("sales")) return "sales-leads";
    return "admin-users";
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
    switch (activeItem) {
      case "admin-users": return <HeroUserManagement />;
      case "mkt-social": return <SocialMediaOverview />;
      case "sales-leads": return <LeadManagement />;
      case "sales-pms": return <PlanningMySaasOverview />;
      default: return <HeroUserManagement />;
    }
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
