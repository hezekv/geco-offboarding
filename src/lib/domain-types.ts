/**
 * Domain-specific type aliases for the GECO Asia HR Portal.
 *
 * WHY THIS FILE EXISTS:
 * The `supabase-types.ts` file is auto-generated directly from the database schema.
 * If we put custom type aliases inside it, they get wiped out every time we run
 * `npx supabase gen types typescript`.
 *
 * Keep all custom business-logic type aliases here so they survive type regeneration.
 */

/** Lifecycle states for an offboarding record */
export type OffboardingStatus = 
  | 'draft' 
  | 'sent' 
  | 'in_progress' 
  | 'completed' 
  | 'archived'

/** Status states for a sub-requirement (task) */
export type SubRequirementStatus = 
  | 'pending' 
  | 'completed' 
  | 'disabled'

/** Application user roles (maps to the public.profile_role ENUM in the database) */
export type UserRole = 'super_admin' | 'hrbp' | 'consultant'