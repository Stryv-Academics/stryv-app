import { Role } from "./roles.types";

// Base Account Interface (shared by all profiles)
export interface Account {
  id: string   /* primary key */;
  first_name?: string;
  last_name?: string;
  username?: string;
  updated_at?: string;
  role?: string;
};
