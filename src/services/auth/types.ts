export type AuthUser = { id: string; email: string };

export interface AuthService {
  getCurrentUser(): Promise<AuthUser | null>;
  signUp(email: string, password: string): Promise<{ error: Error | null }>;
  signIn(email: string, password: string): Promise<{ error: Error | null }>;
  signInWithGoogle(): Promise<{ error: Error | null }>;
  signOut(): Promise<void>;
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void;
  setUser?(user: AuthUser): void; // Optional method for Google auth
}
