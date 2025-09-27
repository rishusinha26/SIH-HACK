export const states = [
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Karnataka', label: 'Karnataka' },
  { value: 'Maharashtra', label: 'Maharashtra' },
  { value: 'Tamil Nadu', label: 'Tamil Nadu' },
  { value: 'West Bengal', label: 'West Bengal' },
  { value: 'Gujarat', label: 'Gujarat' },
  { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
  { value: 'Rajasthan', label: 'Rajasthan' },
  { value: 'Kerala', label: 'Kerala' },
  { value: 'Punjab', label: 'Punjab' }
]

export const courses = [
  { value: 'B.Tech', label: 'B.Tech (Engineering)' },
  { value: 'MBBS', label: 'MBBS (Medicine)' },
  { value: 'B.Sc', label: 'B.Sc (Science)' },
  { value: 'B.Com', label: 'B.Com (Commerce)' },
  { value: 'B.A', label: 'B.A (Arts)' },
  { value: 'B.Des', label: 'B.Des (Design)' },
  { value: 'BBA', label: 'BBA (Business)' },
  { value: 'B.Stat', label: 'B.Stat (Statistics)' }
]

export const entranceExams = {
  'JEE Advanced': { color: 'blue', description: 'Joint Entrance Examination Advanced' },
  'JEE Main': { color: 'blue', description: 'Joint Entrance Examination Main' },
  'NEET': { color: 'red', description: 'National Eligibility cum Entrance Test' },
  'CUET': { color: 'green', description: 'Common University Entrance Test' },
  'DUET': { color: 'green', description: 'Delhi University Entrance Test' },
  'JNUEE': { color: 'purple', description: 'JNU Entrance Examination' },
  'CAT': { color: 'indigo', description: 'Common Admission Test' },
  'GMAT': { color: 'indigo', description: 'Graduate Management Admission Test' },
  'NID DAT': { color: 'purple', description: 'NID Design Aptitude Test' },
  'UCEED': { color: 'purple', description: 'Undergraduate Common Entrance Examination for Design' },
  'AIIMS Entrance': { color: 'red', description: 'AIIMS Entrance Examination' },
  'ISI Entrance': { color: 'orange', description: 'ISI Entrance Examination' },
  'KVPY': { color: 'green', description: 'Kishore Vaigyanik Protsahan Yojana' },
  'IISc Entrance': { color: 'blue', description: 'IISc Entrance Examination' }
}

export const formatCurrency = (amount) => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}K`
  }
  return `₹${amount}`
}
