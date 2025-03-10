import { User } from "./user";

export interface AuthResponse {
    token: string;
    access: string;
    refresh?: string;
    user: User;
  }
  