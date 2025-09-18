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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          address: string | null
          created_at: string
          currency: string
          email: string | null
          fiscal_year_end: string | null
          gaap_standard: string | null
          id: string
          industry: string | null
          name: string
          phone: string | null
          tax_id: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          currency?: string
          email?: string | null
          fiscal_year_end?: string | null
          gaap_standard?: string | null
          id?: string
          industry?: string | null
          name: string
          phone?: string | null
          tax_id?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          currency?: string
          email?: string | null
          fiscal_year_end?: string | null
          gaap_standard?: string | null
          id?: string
          industry?: string | null
          name?: string
          phone?: string | null
          tax_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      company_merge_requests: {
        Row: {
          approved_at: string | null
          approver_id: string | null
          created_at: string | null
          id: string
          reason: string
          rejection_reason: string | null
          requested_by: string
          source_company_id: string
          status: string | null
          target_company_id: string
          updated_at: string | null
          verification_code: string
        }
        Insert: {
          approved_at?: string | null
          approver_id?: string | null
          created_at?: string | null
          id?: string
          reason: string
          rejection_reason?: string | null
          requested_by: string
          source_company_id: string
          status?: string | null
          target_company_id: string
          updated_at?: string | null
          verification_code: string
        }
        Update: {
          approved_at?: string | null
          approver_id?: string | null
          created_at?: string | null
          id?: string
          reason?: string
          rejection_reason?: string | null
          requested_by?: string
          source_company_id?: string
          status?: string | null
          target_company_id?: string
          updated_at?: string | null
          verification_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_merge_requests_source_company_id_fkey"
            columns: ["source_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_merge_requests_target_company_id_fkey"
            columns: ["target_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      consolidation_groups: {
        Row: {
          created_at: string | null
          created_by: string
          gaap_standard: string | null
          id: string
          name: string
          parent_company_id: string | null
          reporting_currency: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          gaap_standard?: string | null
          id?: string
          name: string
          parent_company_id?: string | null
          reporting_currency?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          gaap_standard?: string | null
          id?: string
          name?: string
          parent_company_id?: string | null
          reporting_currency?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consolidation_groups_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      consolidation_members: {
        Row: {
          company_id: string
          consolidation_method: string | null
          created_at: string | null
          effective_date: string | null
          group_id: string
          id: string
          ownership_percentage: number | null
        }
        Insert: {
          company_id: string
          consolidation_method?: string | null
          created_at?: string | null
          effective_date?: string | null
          group_id: string
          id?: string
          ownership_percentage?: number | null
        }
        Update: {
          company_id?: string
          consolidation_method?: string | null
          created_at?: string | null
          effective_date?: string | null
          group_id?: string
          id?: string
          ownership_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "consolidation_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consolidation_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "consolidation_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      exchange_rates: {
        Row: {
          created_at: string | null
          effective_date: string
          from_currency: string
          id: string
          rate: number
          to_currency: string
        }
        Insert: {
          created_at?: string | null
          effective_date: string
          from_currency: string
          id?: string
          rate: number
          to_currency: string
        }
        Update: {
          created_at?: string | null
          effective_date?: string
          from_currency?: string
          id?: string
          rate?: number
          to_currency?: string
        }
        Relationships: []
      }
      merge_request_approvals: {
        Row: {
          approved_at: string | null
          approver_id: string
          company_relationship_confirmed: boolean | null
          id: string
          merge_request_id: string
          notes: string | null
          verification_code_entered: string
        }
        Insert: {
          approved_at?: string | null
          approver_id: string
          company_relationship_confirmed?: boolean | null
          id?: string
          merge_request_id: string
          notes?: string | null
          verification_code_entered: string
        }
        Update: {
          approved_at?: string | null
          approver_id?: string
          company_relationship_confirmed?: boolean | null
          id?: string
          merge_request_id?: string
          notes?: string | null
          verification_code_entered?: string
        }
        Relationships: [
          {
            foreignKeyName: "merge_request_approvals_merge_request_id_fkey"
            columns: ["merge_request_id"]
            isOneToOne: false
            referencedRelation: "company_merge_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          business_name: string | null
          company_name: string
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          setup_completed: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          business_name?: string | null
          company_name: string
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          setup_completed?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          business_name?: string | null
          company_name?: string
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          setup_completed?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_companies: {
        Row: {
          company_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_verification_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      user_role:
        | "admin"
        | "user"
        | "manager"
        | "bookkeeper_basic"
        | "bookkeeper_pro"
        | "bookkeeper_admin"
        | "client"
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
    Enums: {
      user_role: [
        "admin",
        "user",
        "manager",
        "bookkeeper_basic",
        "bookkeeper_pro",
        "bookkeeper_admin",
        "client",
      ],
    },
  },
} as const
