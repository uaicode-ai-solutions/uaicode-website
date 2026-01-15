import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MarketingService {
  id: string;
  service_id: string;
  service_name: string;
  service_icon: string;
  service_description: string;
  uaicode_differentiator: string | null;
  uaicode_price_cents: number;
  traditional_min_cents: number;
  traditional_max_cents: number;
  monthly_deliverables: {
    weekly?: string[];
    monthly?: string[];
    ongoing?: string[];
  };
  whats_included: string[];
  is_recommended: boolean;
  display_order: number;
  // Calculated fields
  savings_min_cents: number;
  savings_max_cents: number;
  savings_percent_min: number;
  savings_percent_max: number;
}

export interface MarketingTotals {
  uaicodeTotal: number;
  traditionalMinTotal: number;
  traditionalMaxTotal: number;
  savingsMinCents: number;
  savingsMaxCents: number;
  savingsPercentMin: number;
  savingsPercentMax: number;
  annualSavingsMin: number;
  annualSavingsMax: number;
}

export function useMarketingTiers() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["marketing-tiers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tb_pms_mkt_tier")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;

      // Calculate derived fields for each service
      return data?.map((service): MarketingService => {
        const savingsMin = service.traditional_min_cents - service.uaicode_price_cents;
        const savingsMax = service.traditional_max_cents - service.uaicode_price_cents;
        
        return {
          id: service.id,
          service_id: service.service_id,
          service_name: service.service_name,
          service_icon: service.service_icon,
          service_description: service.service_description,
          uaicode_differentiator: service.uaicode_differentiator,
          uaicode_price_cents: service.uaicode_price_cents,
          traditional_min_cents: service.traditional_min_cents,
          traditional_max_cents: service.traditional_max_cents,
          monthly_deliverables: (service.monthly_deliverables as MarketingService['monthly_deliverables']) || {},
          whats_included: (service.whats_included as string[]) || [],
          is_recommended: service.is_recommended ?? false,
          display_order: service.display_order ?? 0,
          // Calculated fields
          savings_min_cents: savingsMin,
          savings_max_cents: savingsMax,
          savings_percent_min: service.traditional_min_cents > 0
            ? Math.round((savingsMin / service.traditional_min_cents) * 100)
            : 0,
          savings_percent_max: service.traditional_max_cents > 0
            ? Math.round((savingsMax / service.traditional_max_cents) * 100)
            : 0,
        };
      }) || [];
    },
  });

  return {
    services: data || [],
    isLoading,
    error,
  };
}

export function calculateMarketingTotals(
  selectedServiceIds: string[],
  services: MarketingService[]
): MarketingTotals {
  const selectedServices = services.filter((s) =>
    selectedServiceIds.includes(s.service_id)
  );

  const uaicodeTotal = selectedServices.reduce(
    (acc, s) => acc + s.uaicode_price_cents,
    0
  );
  const traditionalMinTotal = selectedServices.reduce(
    (acc, s) => acc + s.traditional_min_cents,
    0
  );
  const traditionalMaxTotal = selectedServices.reduce(
    (acc, s) => acc + s.traditional_max_cents,
    0
  );

  const savingsMinCents = traditionalMinTotal - uaicodeTotal;
  const savingsMaxCents = traditionalMaxTotal - uaicodeTotal;

  const savingsPercentMin =
    traditionalMinTotal > 0
      ? Math.round((savingsMinCents / traditionalMinTotal) * 100)
      : 0;
  const savingsPercentMax =
    traditionalMaxTotal > 0
      ? Math.round((savingsMaxCents / traditionalMaxTotal) * 100)
      : 0;

  return {
    uaicodeTotal,
    traditionalMinTotal,
    traditionalMaxTotal,
    savingsMinCents,
    savingsMaxCents,
    savingsPercentMin,
    savingsPercentMax,
    annualSavingsMin: savingsMinCents * 12,
    annualSavingsMax: savingsMaxCents * 12,
  };
}
