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
        };
        Insert: {
          consultant_id: string;
          assigned_hr_id?: string | null;
          last_working_day?: string | null;
          id?: string;
        };
        Update: {
          assigned_hr_id?: string | null;
          last_working_day?: string | null;
          status?: OffboardingStatus;
        };
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
        Insert: Omit<
          Database["public"]["Tables"]["offboarding_sub_requirements"]["Row"],
          "id"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["offboarding_sub_requirements"]["Insert"]
        >;
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
      };
      offboarding_requirement_progress: {
        Row: {
          requirement_id: string;
          offboarding_id: string;
          active_tasks: number;
          completed_tasks: number;
        };
      };
    };
  };
}

// Helper types for easier usage in components
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Inserts<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type Updates<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
