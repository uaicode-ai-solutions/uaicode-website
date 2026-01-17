import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PriceModel {
  id: string;
  model_id: string;
  model_name: string;
  description: string;
  icon: string | null;
}

export function usePriceModels() {
  return useQuery({
    queryKey: ['price-models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tb_pms_price_model')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data as PriceModel[];
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
}

// Helper to get description from model_id
export function getPriceModelDescription(
  models: PriceModel[] | undefined, 
  modelId: string
): string {
  if (!models) return 'Pricing model type';
  const model = models.find(m => m.model_id === modelId.toLowerCase());
  return model?.description || 'Pricing model type';
}

// Helper to get full model info
export function getPriceModel(
  models: PriceModel[] | undefined, 
  modelId: string
): PriceModel | undefined {
  if (!models) return undefined;
  return models.find(m => m.model_id === modelId.toLowerCase());
}
