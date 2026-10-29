// src/lib/supabase-types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProfileRole = "super_admin" | "hrbp";
export type OffboardingStatus =
  | "draft"
  | "sent"
  | "in_progress"
  | "completed"
  | "archived";
export type SubRequirementStatus = "pending" | "completed" | "disabled";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string | null;
          role: ProfileRole;
          region: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email?: string | null;
          role?: ProfileRole;
          region?: string;
        };
        Update: {
          full_name?: string;
          email?: string | null;
          role?: ProfileRole;
          region?: string;
        };
        Relationships: [];
      };
      consultants: {
        Row: {
          id: string;
          full_name: string;
          job_title: string | null;
          email: string | null;
          client: string | null;
          project: string | null;
          department: string | null;
          country: string | null;
          engagement_start: string | null;
          engagement_end: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["consultants"]["Row"],
          "id"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["consultants"]["Insert"]>;
        Relationships: [];
      };
      config_requirements: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          is_active: boolean;
          sort_order: number;
          created_by: string | null;
        };
        Insert: {
          name: string;
          description?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_by?: string | null;
          id?: string;
        };
        Update: Partial<
          Omit<
            Database["public"]["Tables"]["config_requirements"]["Insert"],
            "id"
          >
        >;
        Relationships: [
          { foreignKeyName: "config_requirements_created_by_fkey"; columns: ["created_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      config_sub_requirements: {
        Row: {
          id: string;
          requirement_id: string;
          title: string;
          instructions: string | null;
          resource_url: string | null;
          is_disabled: boolean;
          sort_order: number;
        };
        Insert: Omit<
          Database["public"]["Tables"]["config_sub_requirements"]["Row"],
          "id"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["config_sub_requirements"]["Insert"]
        >;
        Relationships: [
          { foreignKeyName: "config_sub_requirements_requirement_id_fkey"; columns: ["requirement_id"]; isOneToOne: false; referencedRelation: "config_requirements"; referencedColumns: ["id"] },
        ];
      };
      config_files: {
        Row: {
          id: string;
          sub_requirement_id: string;
          storage_path: string;
          file_name: string;
          file_type: string | null;
          file_size: number;
          uploaded_by: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["config_files"]["Row"],
          "id"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["config_files"]["Insert"]>;
        Relationships: [
          { foreignKeyName: "config_files_sub_requirement_id_fkey"; columns: ["sub_requirement_id"]; isOneToOne: false; referencedRelation: "config_sub_requirements"; referencedColumns: ["id"] },
          { foreignKeyName: "config_files_uploaded_by_fkey"; columns: ["uploaded_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      offboardings: {
        Row: {
          id: string;
          ob_ref: string;
          consultant_id: string;
          assigned_hr_id: string | null;
          last_working_day: string | null;
          status: OffboardingStatus;
          sent_at: string | null;
          sent_by: string | null;
          completed_at: string | null;
          share_token: string;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          consultant_id: string;
          assigned_hr_id?: string | null;
          last_working_day?: string | null;
          status?: OffboardingStatus;
          created_by?: string | null;
          id?: string;
        };
        Update: {
          assigned_hr_id?: string | null;
          last_working_day?: string | null;
          status?: OffboardingStatus;
          sent_at?: string | null;
          sent_by?: string | null;
          completed_at?: string | null;
        };
        Relationships: [
          { foreignKeyName: "offboardings_consultant_id_fkey"; columns: ["consultant_id"]; isOneToOne: false; referencedRelation: "consultants"; referencedColumns: ["id"] },
          { foreignKeyName: "offboardings_assigned_hr_id_fkey"; columns: ["assigned_hr_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "offboardings_sent_by_fkey"; columns: ["sent_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "offboardings_created_by_fkey"; columns: ["created_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      offboarding_requirements: {
        Row: {
          id: string;
          offboarding_id: string;
          source_config_id: string | null;
          name: string;
          description: string | null;
          sort_order: number;
        };
        Insert: Omit<
          Database["public"]["Tables"]["offboarding_requirements"]["Row"],
          "id"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["offboarding_requirements"]["Insert"]
        >;
        Relationships: [
          { foreignKeyName: "offboarding_requirements_offboarding_id_fkey"; columns: ["offboarding_id"]; isOneToOne: false; referencedRelation: "offboardings"; referencedColumns: ["id"] },
          { foreignKeyName: "offboarding_requirements_source_config_id_fkey"; columns: ["source_config_id"]; isOneToOne: false; referencedRelation: "config_requirements"; referencedColumns: ["id"] },
        ];
      };
      offboarding_sub_requirements: {
        Row: {
          id: string;
          offboarding_requirement_id: string;
          title: string;
          instructions: string | null;
          resource_url: string | null;
          status: SubRequirementStatus;
          completed_at: string | null;
          completed_by: string | null;
          sort_order: number;
        };
        Insert: {
          offboarding_requirement_id: string;
          title: string;
          instructions?: string | null;
          resource_url?: string | null;
          status?: SubRequirementStatus;
          completed_at?: string | null;
          completed_by?: string | null;
          sort_order?: number;
          id?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["offboarding_sub_requirements"]["Insert"]
        >;
        Relationships: [
          { foreignKeyName: "offboarding_sub_requirements_offboarding_requirement_id_fkey"; columns: ["offboarding_requirement_id"]; isOneToOne: false; referencedRelation: "offboarding_requirements"; referencedColumns: ["id"] },
          { foreignKeyName: "offboarding_sub_requirements_completed_by_fkey"; columns: ["completed_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      offboarding_files: {
        Row: {
          id: string;
          offboarding_sub_requirement_id: string;
          source_file_id: string | null;
          storage_path: string;
          file_name: string;
          file_type: string | null;
          file_size: number;
        };
        Insert: Omit<
          Database["public"]["Tables"]["offboarding_files"]["Row"],
          "id"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["offboarding_files"]["Insert"]
        >;
        Relationships: [
          { foreignKeyName: "offboarding_files_offboarding_sub_requirement_id_fkey"; columns: ["offboarding_sub_requirement_id"]; isOneToOne: false; referencedRelation: "offboarding_sub_requirements"; referencedColumns: ["id"] },
          { foreignKeyName: "offboarding_files_source_file_id_fkey"; columns: ["source_file_id"]; isOneToOne: false; referencedRelation: "config_files"; referencedColumns: ["id"] },
        ];
      };
    };
    Views: {
      offboarding_progress: {
        Row: {
          offboarding_id: string;
          status: OffboardingStatus;
          active_tasks: number;
          completed_tasks: number;
        };
        Relationships: [];
      };
      offboarding_requirement_progress: {
        Row: {
          requirement_id: string;
          offboarding_id: string;
          active_tasks: number;
          completed_tasks: number;
        };
        Relationships: [];
      };
    };
    Functions: { [_ in never]: never };
    Enums: {
      profile_role: ProfileRole;
      offboarding_status: OffboardingStatus;
      sub_requirement_status: SubRequirementStatus;
    };
    CompositeTypes: { [_ in never]: never };
  };
}

// Helper types for easier usage in components
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Inserts<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type Updates<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
