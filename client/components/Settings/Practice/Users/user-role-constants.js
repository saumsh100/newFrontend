
export const SUPERADMIN_ROLE = 'SUPERADMIN';
export const OWNER_ROLE = 'OWNER';
export const MANAGER_ROLE = 'MANAGER';
export const ADMIN_ROLE = 'ADMIN';

export const USER_ROLE_OPTIONS = [
  { value: OWNER_ROLE },
  { value: ADMIN_ROLE },
  {
    label: 'USER',
    value: MANAGER_ROLE,
  },
];
