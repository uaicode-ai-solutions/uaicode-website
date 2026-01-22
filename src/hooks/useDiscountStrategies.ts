import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DiscountStrategy {
  id: string;
  discount_id: string;
  discount_name: string;
  discount_percent: number;
  description: string | null;
  validity_hours: number | null;
  bonus_support_days: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useDiscountStrategies = () => {
  return useQuery({
    queryKey: ['discount-strategies'],
    queryFn: async (): Promise<DiscountStrategy[]> => {
      const { data, error } = await supabase
        .from('tb_pms_discount_strategy')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data as DiscountStrategy[];
    },
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });
};

// Helper to get a specific discount by ID
export const getDiscountById = (
  discounts: DiscountStrategy[] | undefined,
  discountId: string
): DiscountStrategy | undefined => {
  return discounts?.find(d => d.discount_id === discountId);
};

// Helper to calculate discounted price
export const calculateDiscountedPrice = (
  originalPriceCents: number,
  discountPercent: number
): number => {
  return Math.round(originalPriceCents * (1 - discountPercent / 100));
};
