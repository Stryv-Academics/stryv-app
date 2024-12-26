export const Roles = {
  STUDENT: "student",
  TUTOR: "tutor",
  PARENT: "parent",
  ADMIN: "admin",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

/**
 * Can access metadata dynamically.
 * Example:
 *   const roleLabel = Roles.ADMIN.label; // 'Administrator'
 */
