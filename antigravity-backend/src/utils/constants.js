export const ROLES = {
  STUDENT: 'student',
  LAB: 'lab',
  HOD: 'hod',
  PRINCIPAL: 'principal'
};

export const STATUSES = {
  LAB_PENDING: 'lab_pending',
  HOD_PENDING: 'hod_pending',
  PRINCIPAL_PENDING: 'principal_pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const BRANCHES = ['COMP', 'EXTC', 'CSE', 'CSE- AIML', 'CSE-DS'];

export const STATUS_FLOW = {
  lab_pending: 'hod_pending',
  hod_pending: 'principal_pending',
  principal_pending: 'approved'
};
