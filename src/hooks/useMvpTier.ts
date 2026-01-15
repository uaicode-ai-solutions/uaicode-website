import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MvpTier, determineMvpTier, calculateDynamicPrice, countFeaturesByTier } from "@/types/report";

interface MvpTierResult {
  tier: MvpTier | null;
  allTiers: MvpTier[];
  tierId: 'starter' | 'growth' | 'enterprise';
  pricing: {
    uaicode: { min: number; max: number; calculated: number };
    traditional: { min: number; max: number };
    savings: { amount: number; percentage: number };
  };
  timeline: {
    uaicode: { min: number; max: number };
    traditional: { min: number; max: number };
  };
  featureCounts: { starter: number; growth: number; enterprise: number };
  isLoading: boolean;
  error: Error | null;
}

export function useMvpTier(selectedFeatures: string[] = []): MvpTierResult {
  const { data: allTiers = [], isLoading, error } = useQuery({
    queryKey: ["mvp-tiers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tb_pms_mvp_tier")
        .select("*")
        .eq("is_active", true)
        .order("min_price_cents", { ascending: true });
      
      if (error) throw error;
      return data as MvpTier[];
    },
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });

  const tierId = determineMvpTier(selectedFeatures);
  const tier = allTiers.find(t => t.tier_id === tierId) || null;
  const featureCounts = countFeaturesByTier(selectedFeatures);

  // Calculate pricing
  let pricing = {
    uaicode: { min: 0, max: 0, calculated: 0 },
    traditional: { min: 0, max: 0 },
    savings: { amount: 0, percentage: 0 },
  };

  if (tier) {
    const dynamicPrice = calculateDynamicPrice(selectedFeatures, tier);
    pricing = {
      uaicode: dynamicPrice,
      traditional: {
        min: tier.traditional_min_cents,
        max: tier.traditional_max_cents,
      },
      savings: {
        amount: tier.traditional_min_cents - dynamicPrice.min,
        percentage: Math.round(((tier.traditional_min_cents - dynamicPrice.min) / tier.traditional_min_cents) * 100),
      },
    };
  }

  // Calculate timeline
  const timeline = tier ? {
    uaicode: { min: tier.min_days, max: tier.max_days },
    traditional: { min: tier.traditional_min_days, max: tier.traditional_max_days },
  } : {
    uaicode: { min: 0, max: 0 },
    traditional: { min: 0, max: 0 },
  };

  return {
    tier,
    allTiers,
    tierId,
    pricing,
    timeline,
    featureCounts,
    isLoading,
    error: error as Error | null,
  };
}
