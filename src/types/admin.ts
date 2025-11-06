import { User } from '@supabase/supabase-js'

export type ApplicationStatus = 'pending' | 'under_review' | 'approved' | 'rejected'

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: 'Pending Review',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected'
}

export interface ApplicationComment {
  id: string
  application_id: string
  comment_text: string
  created_by: string
  created_at: string
  updated_at: string
  is_internal: boolean
  user?: User
}

export interface Application {
  id: string
  full_name: string
  email: string
  phone_number: string
  municipality: string
  school_name: string
  school_level: string
  academic_claims: any[]
  leadership_claims: any[]
  community_service_claims: any[]
  created_at: string
  status: ApplicationStatus
  [key: string]: any
}