// Test data generator utilities
export const generateTestData = () => {
  const municipalities = ['San Jose', 'Sibalom', 'Hamtic', 'Tobias Fornier', 'Anini-y', 'Belison']
  const schools = ['Sibalom National High School', 'EBJ National High School', 'San Jose National High School']
  
  const academicClaims = [
    {
      name: 'Division Math Quiz Bee Champion',
      type_of_participation: 'Contestant',
      rank: '1st or its equivalent',
      level: 'Division/Provincial',
      file_url: ''
    },
    {
      name: 'Regional Schools Press Conference',
      type_of_participation: 'Participant',
      rank: '2nd or its equivalent',
      level: 'Regional',
      file_url: ''
    }
  ]

  const leadershipClaims = [
    {
      name: 'Supreme Student Government',
      type_of_participation: 'Lead Organizer',
      rank: 'President/Mayor/Chairperson',
      level: 'School',
      modality: 'Face-to-Face',
      file_url: ''
    }
  ]

  const communityServiceClaims = [
    {
      name: 'Tree Planting Activity',
      type_of_participation: 'Committee Member',
      rank: 'Member/Participant',
      level: 'Barangay',
      modality: 'Face-to-Face',
      file_url: ''
    }
  ]

  return {
    // General Info
    full_name: 'Juan Dela Cruz',
    complete_address: '123 Sample St., Brgy. Test',
    municipality: municipalities[Math.floor(Math.random() * municipalities.length)],
    phone_number: '09123456789',
    email: 'test@example.com',
    birthday: '2010-01-01',
    age: 15,
    sex: 'Male',

    // School Details
    school_level: 'Junior High School',
    school_name: schools[Math.floor(Math.random() * schools.length)],
    school_address: 'School Address Here',
    school_head_name: 'Dr. Principal Name',
    school_head_email: 'principal@school.edu.ph',
    school_head_mobile: '09187654321',
    class_advisor_name: 'Teacher Name',
    class_advisor_email: 'teacher@school.edu.ph',
    class_advisor_mobile: '09198765432',

    // Claims
    academic_claims: academicClaims,
    leadership_claims: leadershipClaims,
    community_service_claims: communityServiceClaims,

    // Privacy
    data_privacy_accepted: true
  }
}