import { Account } from "./account.types";

// Role-Specific Profiles

// Student
export interface Student extends Account {
  grade_level: string;
  subjects: string[];
}

// Tutor Profile
export interface Tutor extends Account {
  subjects: string[];
  bio: string;
  qualifications: string;
  tutoring_approach: string;
  tutoring_experience: string;
  current_education: string;
  location: string;
}

// Parent Profile
export interface Parent extends Account {
  children_ids: string[]; // References to student profiles
  contact_number?: string;
}

// Admin Profile
export interface Admin extends Account {
  permissions: string[]; // List of permissions assigned to admin
  department?: string; // Optional department information
}

// Unified Profile Type for easier handling
export type Profile = Student | Tutor | Parent | Admin;

// Utility Types

// For creating new profiles (no ID, created_at, or updated_at initially)
export type NewProfile = Omit<Account, "id" | "created_at" | "updated_at"> & {
  role_specific_data?: Partial<Student | Tutor | Parent | Admin>;
};

// For updating profiles (all fields optional)
export type UpdateProfile = Partial<Profile>;

// Read-only profile (useful for fetched data that shouldn't be modified directly)
export type ReadOnlyProfile = Readonly<Profile>;
