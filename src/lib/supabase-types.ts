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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          meta: Json
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          meta?: Json
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          meta?: Json
        }
        Relationships: []
      }
      config_files: {
        Row: {
          created_at: string
          file_name: string
          file_size: number
          file_type: string | null
          id: string
          storage_path: string
          sub_requirement_id: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: number
          file_type?: string | null
          id?: string
          storage_path: string
          sub_requirement_id: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number
          file_type?: string | null
          id?: string
          storage_path?: string
          sub_requirement_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "config_files_sub_requirement_id_fkey"
            columns: ["sub_requirement_id"]
            isOneToOne: false
            referencedRelation: "config_sub_requirements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "config_files_sub_requirement_id_fkey"
            columns: ["sub_requirement_id"]
            isOneToOne: false
            referencedRelation: "v_config_sub_requirements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "config_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      config_requirements: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          kind: string
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          kind?: string
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          kind?: string
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "config_requirements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      config_sub_requirements: {
        Row: {
          created_at: string
          id: string
          instructions: string | null
          is_disabled: boolean
          requirement_id: string
          resource_url: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          instructions?: string | null
          is_disabled?: boolean
          requirement_id: string
          resource_url?: string | null
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          instructions?: string | null
          is_disabled?: boolean
          requirement_id?: string
          resource_url?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "config_sub_requirements_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "config_requirements"
            referencedColumns: ["id"]
          },
        ]
      }
      consultant_documents: {
        Row: {
          consultant_id: string
          created_at: string
          doc_type: string
          expires_at: string | null
          file_name: string
          file_size: number
          file_type: string
          id: string
          issued_at: string | null
          notes: string | null
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          consultant_id: string
          created_at?: string
          doc_type?: string
          expires_at?: string | null
          file_name: string
          file_size?: number
          file_type?: string
          id?: string
          issued_at?: string | null
          notes?: string | null
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          consultant_id?: string
          created_at?: string
          doc_type?: string
          expires_at?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          issued_at?: string | null
          notes?: string | null
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultant_documents_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
        ]
      }
      consultants: {
        Row: {
          bench_since: string | null
          client: string | null
          country: string | null
          created_at: string
          department: string | null
          email: string | null
          engagement_end: string | null
          engagement_start: string | null
          full_name: string
          id: string
          job_title: string | null
          offboarded_at: string | null
          project: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          bench_since?: string | null
          client?: string | null
          country?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          engagement_end?: string | null
          engagement_start?: string | null
          full_name: string
          id?: string
          job_title?: string | null
          offboarded_at?: string | null
          project?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          bench_since?: string | null
          client?: string | null
          country?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          engagement_end?: string | null
          engagement_start?: string | null
          full_name?: string
          id?: string
          job_title?: string | null
          offboarded_at?: string | null
          project?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      offboarding_files: {
        Row: {
          created_at: string
          file_name: string
          file_size: number
          file_type: string | null
          id: string
          offboarding_sub_requirement_id: string
          source_file_id: string | null
          storage_path: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: number
          file_type?: string | null
          id?: string
          offboarding_sub_requirement_id: string
          source_file_id?: string | null
          storage_path: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number
          file_type?: string | null
          id?: string
          offboarding_sub_requirement_id?: string
          source_file_id?: string | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "offboarding_files_offboarding_sub_requirement_id_fkey"
            columns: ["offboarding_sub_requirement_id"]
            isOneToOne: false
            referencedRelation: "offboarding_sub_requirements"
            referencedColumns: ["id"]
          },
        ]
      }
      offboarding_requirements: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          offboarding_id: string
          sort_order: number
          source_config_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          offboarding_id: string
          sort_order?: number
          source_config_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          offboarding_id?: string
          sort_order?: number
          source_config_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offboarding_requirements_offboarding_id_fkey"
            columns: ["offboarding_id"]
            isOneToOne: false
            referencedRelation: "offboarding_progress"
            referencedColumns: ["offboarding_id"]
          },
          {
            foreignKeyName: "offboarding_requirements_offboarding_id_fkey"
            columns: ["offboarding_id"]
            isOneToOne: false
            referencedRelation: "offboardings"
            referencedColumns: ["id"]
          },
        ]
      }
      offboarding_sub_requirements: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          created_at: string
          id: string
          instructions: string | null
          offboarding_requirement_id: string
          resource_url: string | null
          sort_order: number
          status: Database["public"]["Enums"]["sub_requirement_status"]
          title: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: string
          instructions?: string | null
          offboarding_requirement_id: string
          resource_url?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["sub_requirement_status"]
          title: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: string
          instructions?: string | null
          offboarding_requirement_id?: string
          resource_url?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["sub_requirement_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offboarding_sub_requirements_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offboarding_sub_requirements_offboarding_requirement_id_fkey"
            columns: ["offboarding_requirement_id"]
            isOneToOne: false
            referencedRelation: "offboarding_requirement_progress"
            referencedColumns: ["requirement_id"]
          },
          {
            foreignKeyName: "offboarding_sub_requirements_offboarding_requirement_id_fkey"
            columns: ["offboarding_requirement_id"]
            isOneToOne: false
            referencedRelation: "offboarding_requirements"
            referencedColumns: ["id"]
          },
        ]
      }
      offboardings: {
        Row: {
          assigned_hr_id: string | null
          completed_at: string | null
          consultant_id: string
          created_at: string
          created_by: string | null
          id: string
          last_working_day: string | null
          ob_ref: string
          sent_at: string | null
          sent_by: string | null
          share_token: string | null
          status: Database["public"]["Enums"]["offboarding_status"]
          updated_at: string
        }
        Insert: {
          assigned_hr_id?: string | null
          completed_at?: string | null
          consultant_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          last_working_day?: string | null
          ob_ref: string
          sent_at?: string | null
          sent_by?: string | null
          share_token?: string | null
          status?: Database["public"]["Enums"]["offboarding_status"]
          updated_at?: string
        }
        Update: {
          assigned_hr_id?: string | null
          completed_at?: string | null
          consultant_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          last_working_day?: string | null
          ob_ref?: string
          sent_at?: string | null
          sent_by?: string | null
          share_token?: string | null
          status?: Database["public"]["Enums"]["offboarding_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offboardings_assigned_hr_id_fkey"
            columns: ["assigned_hr_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offboardings_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offboardings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offboardings_sent_by_fkey"
            columns: ["sent_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_files: {
        Row: {
          created_at: string
          file_name: string
          file_size: number
          file_type: string
          id: string
          onboarding_sub_requirement_id: string
          source_file_id: string | null
          storage_path: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: number
          file_type?: string
          id?: string
          onboarding_sub_requirement_id: string
          source_file_id?: string | null
          storage_path: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          onboarding_sub_requirement_id?: string
          source_file_id?: string | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_files_onboarding_sub_requirement_id_fkey"
            columns: ["onboarding_sub_requirement_id"]
            isOneToOne: false
            referencedRelation: "onboarding_sub_requirements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_files_source_file_id_fkey"
            columns: ["source_file_id"]
            isOneToOne: false
            referencedRelation: "config_files"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_requirements: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          onboarding_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          onboarding_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          onboarding_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_requirements_onboarding_id_fkey"
            columns: ["onboarding_id"]
            isOneToOne: false
            referencedRelation: "onboardings"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_sub_requirements: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          created_at: string
          id: string
          instructions: string | null
          onboarding_requirement_id: string
          resource_url: string | null
          sort_order: number
          status: string
          title: string
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: string
          instructions?: string | null
          onboarding_requirement_id: string
          resource_url?: string | null
          sort_order?: number
          status?: string
          title: string
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: string
          instructions?: string | null
          onboarding_requirement_id?: string
          resource_url?: string | null
          sort_order?: number
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_sub_requirements_onboarding_requirement_id_fkey"
            columns: ["onboarding_requirement_id"]
            isOneToOne: false
            referencedRelation: "onboarding_requirements"
            referencedColumns: ["id"]
          },
        ]
      }
      onboardings: {
        Row: {
          assigned_hr_id: string | null
          completed_at: string | null
          consultant_id: string
          created_at: string
          day_one_date: string
          id: string
          on_ref: string
          sent_at: string | null
          sent_by: string | null
          status: string
        }
        Insert: {
          assigned_hr_id?: string | null
          completed_at?: string | null
          consultant_id: string
          created_at?: string
          day_one_date: string
          id?: string
          on_ref: string
          sent_at?: string | null
          sent_by?: string | null
          status?: string
        }
        Update: {
          assigned_hr_id?: string | null
          completed_at?: string | null
          consultant_id?: string
          created_at?: string
          day_one_date?: string
          id?: string
          on_ref?: string
          sent_at?: string | null
          sent_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboardings_assigned_hr_id_fkey"
            columns: ["assigned_hr_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboardings_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          region: string
          role: Database["public"]["Enums"]["profile_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id: string
          region?: string
          role?: Database["public"]["Enums"]["profile_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          region?: string
          role?: Database["public"]["Enums"]["profile_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      offboarding_progress: {
        Row: {
          active_tasks: number | null
          completed_tasks: number | null
          offboarding_id: string | null
          status: Database["public"]["Enums"]["offboarding_status"] | null
        }
        Relationships: []
      }
      offboarding_requirement_progress: {
        Row: {
          active_tasks: number | null
          completed_tasks: number | null
          offboarding_id: string | null
          requirement_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offboarding_requirements_offboarding_id_fkey"
            columns: ["offboarding_id"]
            isOneToOne: false
            referencedRelation: "offboarding_progress"
            referencedColumns: ["offboarding_id"]
          },
          {
            foreignKeyName: "offboarding_requirements_offboarding_id_fkey"
            columns: ["offboarding_id"]
            isOneToOne: false
            referencedRelation: "offboardings"
            referencedColumns: ["id"]
          },
        ]
      }
      v_config_sub_requirements: {
        Row: {
          config_requirement_id: string | null
          created_at: string | null
          id: string | null
          instructions: string | null
          is_disabled: boolean | null
          requirement_id: string | null
          resource_url: string | null
          sort_order: number | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          config_requirement_id?: string | null
          created_at?: string | null
          id?: string | null
          instructions?: string | null
          is_disabled?: boolean | null
          requirement_id?: string | null
          resource_url?: string | null
          sort_order?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          config_requirement_id?: string | null
          created_at?: string | null
          id?: string | null
          instructions?: string | null
          is_disabled?: boolean | null
          requirement_id?: string | null
          resource_url?: string | null
          sort_order?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "config_sub_requirements_requirement_id_fkey"
            columns: ["config_requirement_id"]
            isOneToOne: false
            referencedRelation: "config_requirements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "config_sub_requirements_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "config_requirements"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      current_profile_role: {
        Args: never
        Returns: Database["public"]["Enums"]["profile_role"]
      }
      fn_assert_offboarding_mutable: {
        Args: { p_offboarding_id: string }
        Returns: undefined
      }
      fn_assert_requirement_mutable: {
        Args: { p_requirement_id: string }
        Returns: undefined
      }
      fn_assert_subrequirement_mutable: {
        Args: { p_sub_id: string }
        Returns: undefined
      }
      fn_sync_offboarding_status: {
        Args: { p_offboarding_id: string }
        Returns: undefined
      }
      is_hr: { Args: never; Returns: boolean }
      my_consultant_id: { Args: never; Returns: string }
    }
    Enums: {
      offboarding_status:
        | "draft"
        | "sent"
        | "in_progress"
        | "completed"
        | "archived"
      profile_role: "super_admin" | "hrbp" | "consultant"
      sub_requirement_status: "pending" | "completed" | "disabled"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      offboarding_status: [
        "draft",
        "sent",
        "in_progress",
        "completed",
        "archived",
      ],
      profile_role: ["super_admin", "hrbp", "consultant"],
      sub_requirement_status: ["pending", "completed", "disabled"],
    },
  },
} as const
