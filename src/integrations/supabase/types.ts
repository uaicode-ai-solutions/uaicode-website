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
      tb_pms_mkt_tier: {
        Row: {
          ad_spend_fee_percent: number | null
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          is_recommended: boolean | null
          market_notes: string | null
          market_source: string | null
          monthly_deliverables: Json | null
          research_date: string | null
          service_description: string
          service_icon: string
          service_id: string
          service_name: string
          traditional_max_cents: number
          traditional_min_cents: number
          uaicode_differentiator: string | null
          uaicode_price_cents: number
          updated_at: string | null
          whats_included: Json | null
          whats_not_included: Json | null
        }
        Insert: {
          ad_spend_fee_percent?: number | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_recommended?: boolean | null
          market_notes?: string | null
          market_source?: string | null
          monthly_deliverables?: Json | null
          research_date?: string | null
          service_description: string
          service_icon: string
          service_id: string
          service_name: string
          traditional_max_cents: number
          traditional_min_cents: number
          uaicode_differentiator?: string | null
          uaicode_price_cents: number
          updated_at?: string | null
          whats_included?: Json | null
          whats_not_included?: Json | null
        }
        Update: {
          ad_spend_fee_percent?: number | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_recommended?: boolean | null
          market_notes?: string | null
          market_source?: string | null
          monthly_deliverables?: Json | null
          research_date?: string | null
          service_description?: string
          service_icon?: string
          service_id?: string
          service_name?: string
          traditional_max_cents?: number
          traditional_min_cents?: number
          uaicode_differentiator?: string | null
          uaicode_price_cents?: number
          updated_at?: string | null
          whats_included?: Json | null
          whats_not_included?: Json | null
        }
        Relationships: []
      }
      tb_pms_mvp_tier: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          max_days: number
          max_price_cents: number
          min_days: number
          min_price_cents: number
          tier_id: string
          tier_name: string
          traditional_max_cents: number
          traditional_max_days: number
          traditional_min_cents: number
          traditional_min_days: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          max_days: number
          max_price_cents: number
          min_days: number
          min_price_cents: number
          tier_id: string
          tier_name: string
          traditional_max_cents: number
          traditional_max_days: number
          traditional_min_cents: number
          traditional_min_days: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          max_days?: number
          max_price_cents?: number
          min_days?: number
          min_price_cents?: number
          tier_id?: string
          tier_name?: string
          traditional_max_cents?: number
          traditional_max_days?: number
          traditional_min_cents?: number
          traditional_min_days?: number
        }
        Relationships: []
      }
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
            referencedRelation: "tb_pms_wizard"
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
      tb_pms_price_model: {
        Row: {
          created_at: string | null
          description: string
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          model_id: string
          model_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          model_id: string
          model_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          model_id?: string
          model_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tb_pms_reports: {
        Row: {
          benchmark_section: Json | null
          competitive_analysis_section: Json | null
          created_at: string
          growth_intelligence_section: Json | null
          hero_score_section: Json | null
          icp_avatar_url: string | null
          icp_intelligence_section: Json | null
          id: string
          opportunity_section: Json | null
          paid_media_intelligence_section: Json | null
          price_intelligence_section: Json | null
          section_investment: Json | null
          status: string
          summary_section: Json | null
          updated_at: string
          wizard_id: string
        }
        Insert: {
          benchmark_section?: Json | null
          competitive_analysis_section?: Json | null
          created_at?: string
          growth_intelligence_section?: Json | null
          hero_score_section?: Json | null
          icp_avatar_url?: string | null
          icp_intelligence_section?: Json | null
          id?: string
          opportunity_section?: Json | null
          paid_media_intelligence_section?: Json | null
          price_intelligence_section?: Json | null
          section_investment?: Json | null
          status?: string
          summary_section?: Json | null
          updated_at?: string
          wizard_id: string
        }
        Update: {
          benchmark_section?: Json | null
          competitive_analysis_section?: Json | null
          created_at?: string
          growth_intelligence_section?: Json | null
          hero_score_section?: Json | null
          icp_avatar_url?: string | null
          icp_intelligence_section?: Json | null
          id?: string
          opportunity_section?: Json | null
          paid_media_intelligence_section?: Json | null
          price_intelligence_section?: Json | null
          section_investment?: Json | null
          status?: string
          summary_section?: Json | null
          updated_at?: string
          wizard_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tb_pms_reports_wizard_id_fkey"
            columns: ["wizard_id"]
            isOneToOne: false
            referencedRelation: "tb_pms_wizard"
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
      tb_pms_wizard: {
        Row: {
          budget: string | null
          challenge: string | null
          created_at: string
          customer_types: string[] | null
          description: string | null
          geographic_region: string | null
          goal: string | null
          goal_other: string | null
          id: string
          industry: string | null
          industry_other: string | null
          market_size: string | null
          market_type: string | null
          product_stage: string | null
          saas_logo_url: string | null
          saas_name: string
          saas_type: string | null
          saas_type_other: string | null
          selected_features: string[] | null
          selected_tier: string | null
          status: string
          target_audience: string | null
          timeline: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          budget?: string | null
          challenge?: string | null
          created_at?: string
          customer_types?: string[] | null
          description?: string | null
          geographic_region?: string | null
          goal?: string | null
          goal_other?: string | null
          id?: string
          industry?: string | null
          industry_other?: string | null
          market_size?: string | null
          market_type?: string | null
          product_stage?: string | null
          saas_logo_url?: string | null
          saas_name: string
          saas_type?: string | null
          saas_type_other?: string | null
          selected_features?: string[] | null
          selected_tier?: string | null
          status?: string
          target_audience?: string | null
          timeline?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          budget?: string | null
          challenge?: string | null
          created_at?: string
          customer_types?: string[] | null
          description?: string | null
          geographic_region?: string | null
          goal?: string | null
          goal_other?: string | null
          id?: string
          industry?: string | null
          industry_other?: string | null
          market_size?: string | null
          market_type?: string | null
          product_stage?: string | null
          saas_logo_url?: string | null
          saas_name?: string
          saas_type?: string | null
          saas_type_other?: string | null
          selected_features?: string[] | null
          selected_tier?: string | null
          status?: string
          target_audience?: string | null
          timeline?: string | null
          updated_at?: string
          user_id?: string
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
