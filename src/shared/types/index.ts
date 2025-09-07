// Common types used across frontend and backend

export interface Patient {
  id?: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  ssn?: string
  address: Address
  emergencyContact: EmergencyContact
  medicalHistory?: MedicalHistory[]
  createdAt?: string
  updatedAt?: string
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country?: string
}

export interface EmergencyContact {
  name: string
  relationship: string
  phoneNumber: string
  email?: string
}

export interface MedicalHistory {
  condition: string
  diagnosis: string
  medications: string[]
  allergies: string[]
  notes?: string
}

export interface PCRReport {
  id?: string
  patientId: string
  incidentNumber: string
  date: string
  time: string
  location: Address
  chiefComplaint: string
  presentIllness: string
  assessment: Assessment
  treatment: Treatment[]
  vitals: VitalSigns[]
  medications: MedicationAdministered[]
  procedures: Procedure[]
  transport: Transport
  disposition: string
  signature: string
  createdBy: string
  createdAt?: string
  updatedAt?: string
  status: 'draft' | 'completed' | 'submitted' | 'archived'
}

export interface Assessment {
  primary: string
  secondary?: string
  impressions: string[]
  priority: 'low' | 'medium' | 'high' | 'critical'
}

export interface Treatment {
  id: string
  time: string
  intervention: string
  response: string
  performedBy: string
}

export interface VitalSigns {
  time: string
  bloodPressure: {
    systolic: number
    diastolic: number
  }
  heartRate: number
  respiratoryRate: number
  temperature: number
  oxygenSaturation: number
  painScale?: number
  glucoseLevel?: number
  notes?: string
}

export interface MedicationAdministered {
  name: string
  dosage: string
  route: string
  time: string
  administeredBy: string
  indication: string
}

export interface Procedure {
  name: string
  time: string
  outcome: string
  performedBy: string
  complications?: string
}

export interface Transport {
  mode: 'ambulance' | 'helicopter' | 'walk-in' | 'other'
  destination: string
  departureTime: string
  arrivalTime: string
  condition: 'stable' | 'unstable' | 'critical'
  monitoring: string[]
}

export interface User {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  role: 'emt' | 'paramedic' | 'supervisor' | 'admin'
  licenseNumber: string
  department: string
  isActive: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  expiresIn: number
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
}

// Form validation types
export interface ValidationError {
  field: string
  message: string
}

export interface FormErrors {
  [key: string]: string[]
}