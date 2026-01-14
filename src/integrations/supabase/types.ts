export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      tb_pms_payments: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          id: string
          paid_at: string | null
          plan_type: string
          report_id: string
          status: string
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          user_id: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          plan_type: string
          report_id: string
          status?: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          user_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          plan_type?: string
          report_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tb_pln_payments_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "tb_pms_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tb_pln_payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "tb_pms_users"
            referencedColumns: ["id"]
          },
        ]
      }
      tb_pms_reports: {
        Row: {
          arr_projected_cents: string | null
          assets_brand_copy: Json | null
          assets_brand_identity: Json | null
          assets_landing_page: Json | null
          assets_logos: Json | null
          assets_mockup_previews: Json | null
          assets_screen_mockups: Json | null
          break_even_months: string | null
          budget: string | null
          business_model: Json | null
          challenge: string | null
          competitive_advantages: Json | null
          competitors: Json | null
          complexity_score: string | null
          created_at: string
          customer_types: string[] | null
          demand_validation: Json | null
          description: string | null
          differentiation_score: string | null
          execution_timeline: Json | null
          expected_roi_year1: string | null
          financial_scenarios: Json | null
          first_mover_score: string | null
          generated_at: string | null
          go_to_market_preview: Json | null
          goal: string | null
          goal_other: string | null
          highlights: Json | null
          id: string
          industry: string | null
          industry_other: string | null
          investment_breakdown: Json | null
          investment_comparison: Json | null
          investment_included: Json | null
          investment_not_included: Json | null
          investment_total_cents: string | null
          key_metrics: Json | null
          ltv_cac_ratio: string | null
          market_benchmarks: Json | null
          market_opportunity: Json | null
          market_size: string | null
          market_type: string | null
          marketing_competitive_advantages: Json | null
          marketing_four_ps: Json | null
          marketing_growth_strategy: Json | null
          marketing_paid_media_action_plan: Json | null
          marketing_paid_media_diagnosis: Json | null
          marketing_pricing_action_plan: Json | null
          marketing_pricing_diagnosis: Json | null
          marketing_verdict: Json | null
          mrr_month12_cents: string | null
          next_steps: Json | null
          opportunity_score: string | null
          pivot_readiness_score: string | null
          pivot_scenarios: Json | null
          product_stage: string | null
          projection_data: Json | null
          quantified_differentiation: Json | null
          report_content: Json | null
          resource_requirements: Json | null
          risk_quantification: Json | null
          risk_score: string | null
          risks: Json | null
          saas_logo_url: string | null
          saas_name: string
          saas_type: string | null
          saas_type_other: string | null
          selected_features: string[] | null
          selected_tier: string | null
          status: string
          success_metrics: Json | null
          target_audience: string | null
          tech_stack: Json | null
          timeline: string | null
          timing_analysis: Json | null
          timing_score: string | null
          uaicode_info: Json | null
          unit_economics: Json | null
          updated_at: string
          user_id: string
          verdict: string | null
          verdict_headline: string | null
          verdict_summary: string | null
          viability_score: string | null
        }
        Insert: {
          arr_projected_cents?: string | null
          assets_brand_copy?: Json | null
          assets_brand_identity?: Json | null
          assets_landing_page?: Json | null
          assets_logos?: Json | null
          assets_mockup_previews?: Json | null
          assets_screen_mockups?: Json | null
          break_even_months?: string | null
          budget?: string | null
          business_model?: Json | null
          challenge?: string | null
          competitive_advantages?: Json | null
          competitors?: Json | null
          complexity_score?: string | null
          created_at?: string
          customer_types?: string[] | null
          demand_validation?: Json | null
          description?: string | null
          differentiation_score?: string | null
          execution_timeline?: Json | null
          expected_roi_year1?: string | null
          financial_scenarios?: Json | null
          first_mover_score?: string | null
          generated_at?: string | null
          go_to_market_preview?: Json | null
          goal?: string | null
          goal_other?: string | null
          highlights?: Json | null
          id?: string
          industry?: string | null
          industry_other?: string | null
          investment_breakdown?: Json | null
          investment_comparison?: Json | null
          investment_included?: Json | null
          investment_not_included?: Json | null
          investment_total_cents?: string | null
          key_metrics?: Json | null
          ltv_cac_ratio?: string | null
          market_benchmarks?: Json | null
          market_opportunity?: Json | null
          market_size?: string | null
          market_type?: string | null
          marketing_competitive_advantages?: Json | null
          marketing_four_ps?: Json | null
          marketing_growth_strategy?: Json | null
          marketing_paid_media_action_plan?: Json | null
          marketing_paid_media_diagnosis?: Json | null
          marketing_pricing_action_plan?: Json | null
          marketing_pricing_diagnosis?: Json | null
          marketing_verdict?: Json | null
          mrr_month12_cents?: string | null
          next_steps?: Json | null
          opportunity_score?: string | null
          pivot_readiness_score?: string | null
          pivot_scenarios?: Json | null
          product_stage?: string | null
          projection_data?: Json | null
          quantified_differentiation?: Json | null
          report_content?: Json | null
          resource_requirements?: Json | null
          risk_quantification?: Json | null
          risk_score?: string | null
          risks?: Json | null
          saas_logo_url?: string | null
          saas_name: string
          saas_type?: string | null
          saas_type_other?: string | null
          selected_features?: string[] | null
          selected_tier?: string | null
          status?: string
          success_metrics?: Json | null
          target_audience?: string | null
          tech_stack?: Json | null
          timeline?: string | null
          timing_analysis?: Json | null
          timing_score?: string | null
          uaicode_info?: Json | null
          unit_economics?: Json | null
          updated_at?: string
          user_id: string
          verdict?: string | null
          verdict_headline?: string | null
          verdict_summary?: string | null
          viability_score?: string | null
        }
        Update: {
          arr_projected_cents?: string | null
          assets_brand_copy?: Json | null
          assets_brand_identity?: Json | null
          assets_landing_page?: Json | null
          assets_logos?: Json | null
          assets_mockup_previews?: Json | null
          assets_screen_mockups?: Json | null
          break_even_months?: string | null
          budget?: string | null
          business_model?: Json | null
          challenge?: string | null
          competitive_advantages?: Json | null
          competitors?: Json | null
          complexity_score?: string | null
          created_at?: string
          customer_types?: string[] | null
          demand_validation?: Json | null
          description?: string | null
          differentiation_score?: string | null
          execution_timeline?: Json | null
          expected_roi_year1?: string | null
          financial_scenarios?: Json | null
          first_mover_score?: string | null
          generated_at?: string | null
          go_to_market_preview?: Json | null
          goal?: string | null
          goal_other?: string | null
          highlights?: Json | null
          id?: string
          industry?: string | null
          industry_other?: string | null
          investment_breakdown?: Json | null
          investment_comparison?: Json | null
          investment_included?: Json | null
          investment_not_included?: Json | null
          investment_total_cents?: string | null
          key_metrics?: Json | null
          ltv_cac_ratio?: string | null
          market_benchmarks?: Json | null
          market_opportunity?: Json | null
          market_size?: string | null
          market_type?: string | null
          marketing_competitive_advantages?: Json | null
          marketing_four_ps?: Json | null
          marketing_growth_strategy?: Json | null
          marketing_paid_media_action_plan?: Json | null
          marketing_paid_media_diagnosis?: Json | null
          marketing_pricing_action_plan?: Json | null
          marketing_pricing_diagnosis?: Json | null
          marketing_verdict?: Json | null
          mrr_month12_cents?: string | null
          next_steps?: Json | null
          opportunity_score?: string | null
          pivot_readiness_score?: string | null
          pivot_scenarios?: Json | null
          product_stage?: string | null
          projection_data?: Json | null
          quantified_differentiation?: Json | null
          report_content?: Json | null
          resource_requirements?: Json | null
          risk_quantification?: Json | null
          risk_score?: string | null
          risks?: Json | null
          saas_logo_url?: string | null
          saas_name?: string
          saas_type?: string | null
          saas_type_other?: string | null
          selected_features?: string[] | null
          selected_tier?: string | null
          status?: string
          success_metrics?: Json | null
          target_audience?: string | null
          tech_stack?: Json | null
          timeline?: string | null
          timing_analysis?: Json | null
          timing_score?: string | null
          uaicode_info?: Json | null
          unit_economics?: Json | null
          updated_at?: string
          user_id?: string
          verdict?: string | null
          verdict_headline?: string | null
          verdict_summary?: string | null
          viability_score?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tb_pln_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "tb_pms_users"
            referencedColumns: ["id"]
          },
        ]
      }
      tb_pms_users: {
        Row: {
          auth_user_id: string
          created_at: string
          email: string
          full_name: string
          id: string
          linkedin_profile: string | null
          phone: string | null
          updated_at: string
          user_role: string | null
          user_role_other: string | null
          username: string | null
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          linkedin_profile?: string | null
          phone?: string | null
          updated_at?: string
          user_role?: string | null
          user_role_other?: string | null
          username?: string | null
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          linkedin_profile?: string | null
          phone?: string | null
          updated_at?: string
          user_role?: string | null
          user_role_other?: string | null
          username?: string | null
        }
        Relationships: []
      }
      tb_web_appointment: {
        Row: {
          appointmentDate: string | null
          appointmentId: string | null
          appointmentNotes: string | null
          appointmentType: string | null
          appointmentUid: string | null
          created_at: string
          email: string | null
          id: number
        }
        Insert: {
          appointmentDate?: string | null
          appointmentId?: string | null
          appointmentNotes?: string | null
          appointmentType?: string | null
          appointmentUid?: string | null
          created_at?: string
          email?: string | null
          id?: number
        }
        Update: {
          appointmentDate?: string | null
          appointmentId?: string | null
          appointmentNotes?: string | null
          appointmentType?: string | null
          appointmentUid?: string | null
          created_at?: string
          email?: string | null
          id?: number
        }
        Relationships: []
      }
      tb_web_call: {
        Row: {
          created_at: string
          date: string | null
          id: number
          outcome: string | null
          summary: string | null
        }
        Insert: {
          created_at?: string
          date?: string | null
          id?: number
          outcome?: string | null
          summary?: string | null
        }
        Update: {
          created_at?: string
          date?: string | null
          id?: number
          outcome?: string | null
          summary?: string | null
        }
        Relationships: []
      }
      tb_web_chat_conversations: {
        Row: {
          created_at: string
          id: string
          session_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          session_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          session_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      tb_web_chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "tb_web_chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      tb_web_leads: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: number
          phone: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: number
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: number
          phone?: string | null
        }
        Relationships: []
      }
      tb_web_newsletter: {
        Row: {
          created_at: string
          email: string
          id: number
          source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_session_id: { Args: never; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
