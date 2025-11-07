// Claim types for Academic, Leadership, and Community Service profiles
export interface AcademicClaim {
  name: string
  type_of_participation: string
  rank: string
  level: string
  file_url?: string
}

export interface LeadershipClaim {
  name: string
  type_of_participation: string
  rank: string
  level: string
  modality: string
  file_url?: string
}

export interface CommunityServiceClaim {
  name: string
  type_of_participation: string
  rank: string
  level: string
  modality: string
  file_url?: string
}

// Main form data interface
export interface TOPSFormData {
  // I. General Information
  full_name: string
  complete_address: string
  municipality: string
  phone_number: string
  email: string
  birthday: string
  age: number
  sex: string
  
  // School Details
  school_level: string
  school_name: string
  school_address: string
  school_head_name: string
  school_head_email: string
  school_head_mobile: string
  class_advisor_name: string
  class_advisor_email: string
  class_advisor_mobile: string
  
  // II. Requirements
  nomination_letter_url?: string
  academic_records_url?: string
  certificate_truthfulness_url?: string
  photo_2x2_url?: string
  
  // III. Academic Profile (up to 20 claims)
  academic_claims: AcademicClaim[]
  
  // IV. Leadership Profile (up to 20 claims)
  leadership_claims: LeadershipClaim[]
  
  // V. Community Service Profile (up to 20 claims)
  community_service_claims: CommunityServiceClaim[]
  
  // Data Privacy Confirmation
  data_privacy_accepted: boolean
}

// Dropdown options
export const SCHOOL_LEVELS = [
  'Elementary',
  'Junior High School',
  'Senior High School'
]

export const SEX_OPTIONS = ['Male', 'Female']

export const ANTIQUE_MUNICIPALITIES = [
  'Anini-y',
  'Barbaza',
  'Belison',
  'Bugasong',
  'Caluya',
  'Culasi',
  'Hamtic',
  'Laua-an',
  'Libertad',
  'Pandan',
  'Patnongon',
  'San Jose',
  'San Remigio',
  'Sebaste',
  'Sibalom',
  'Tibiao',
  'Tobias Fornier',
  'Valderrama'
]

export const ACADEMIC_PARTICIPATION_TYPES = [
  'Contestant',
  'Participant',
  'N/A'
]

export const ACADEMIC_RANKS = [
  '1st or its equivalent',
  '2nd or its equivalent',
  '3rd or its equivalent',
  'Other ranks',
  'None'
]

export const ACADEMIC_LEVELS = [
  'Homeroom',
  'Grade',
  'School',
  'District',
  'Cluster',
  'Division/Provincial',
  'Regional',
  'National',
  'International',
  'N/A'
]

export const LEADERSHIP_PARTICIPATION_TYPES = [
  'Lead Organizer',
  'Committee Chairperson',
  'Committee Member',
  'Participant/Member',
  'Others'
]

export const LEADERSHIP_RANKS = [
  'President/Major/Chairperson',
  'Vice President/Vice Mayor/Vice Chairperson',
  'Other school positions',
  'Learning Participant',
  'Editor-in-Chief',
  'Associate Editor',
  'Managing Editor/Business Manager',
  '1st PLACE/RECIPIENT',
  '2nd PLACE/RECIPIENT',
  '3rd PLACE/RECIPIENT'
]

export const LEADERSHIP_LEVELS = [
  'MUNICIPAL',
  'SCHOOL',
  'DISTRICT',
  'DIVISION',
  'CLUSTER',
  'PROVINCIAL',
  'REGIONAL',
  'NATIONAL',
  'INTERNATIONAL',
  'N/A'
]

export const MODALITY_OPTIONS = [
  'Face-to-Face',
  'Online',
  'Hybrid',
  'N/A'
]

export const COMMUNITY_PARTICIPATION_TYPES = [
  'Lead Organizer',
  'Committee Chairperson',
  'Committee Member',
  'Participant/Member',
  'Others',
  'N/A'
]

export const COMMUNITY_RANKS = [
  'President/Mayor/Chairperson',
  'Vice President/Vice Mayor/Vice Chairperson',
  'Member/Participant',
  '1st or its equivalent',
  '2nd or its equivalent',
  '3rd or its equivalent',
  'Other ranks/positions',
  'None'
]

export const COMMUNITY_LEVELS = [
  'Barangay',
  'Municipal',
  'Cluster',
  'Provincial',
  'Regional',
  'National',
  'International',
  'N/A'
]
