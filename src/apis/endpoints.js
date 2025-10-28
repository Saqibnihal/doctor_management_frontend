// AUTHENTICATION
export const ADMIN_LOGIN = '/admin/login';
export const DOCTOR_LOGIN = '/doctor/login';
export const PATIENT_REGISTER = '/patient/register';
export const PATIENT_LOGIN = '/patient/login';

// ADMIN ENDPOINTS
export const ADMIN_CREATE_DOCTOR = '/admin/doctors';
export const ADMIN_GET_DOCTORS = '/admin/doctors';
export const ADMIN_GET_ALL_DOCTORS = '/admin/doctors'; 
export const ADMIN_UPDATE_DOCTOR = (id) => `/admin/doctors/${id}`;
export const ADMIN_DELETE_DOCTOR = (id) => `/admin/doctors/${id}`;

export const ADMIN_CREATE_PATIENT = '/admin/patients';
export const ADMIN_GET_PATIENTS = '/admin/patients';
export const ADMIN_GET_ALL_PATIENTS = '/admin/patients'; 
export const ADMIN_UPDATE_PATIENT = (id) => `/admin/patients/${id}`;
export const ADMIN_DELETE_PATIENT = (id) => `/admin/patients/${id}`;

export const ADMIN_ASSIGN_PATIENT_TO_DOCTOR = (id) =>
  `/admin/patients/${id}/assign-doctor`;

export const ADMIN_DASHBOARD = '/admin/dashboard';

// DOCTOR ENDPOINTS
export const DOCTOR_GET_PATIENTS = (doctorId) => `/doctor/${doctorId}/patients`;
export const DOCTOR_GET_APPOINTMENTS = (doctorId) =>
  `/doctor/${doctorId}/appointments`;
export const DOCTOR_UPDATE_PATIENT = (patientId) =>
  `/doctor/patients/${patientId}`;

// PATIENT ENDPOINTS
export const PATIENT_GET_DOCTORS = '/patient/doctors';
export const PATIENT_BOOK_APPOINTMENT = '/patient/appointments';
export const PATIENT_GET_APPOINTMENTS = (patientId) =>
  `/patient/appointments/${patientId}`;
