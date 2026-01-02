import type { AuthService, AuthUser } from './types';

export const createGoogleAuthService = (): AuthService => {
  let listeners = new Set<(user: AuthUser | null) => void>();
  const notify = (user: AuthUser | null) => {
    listeners.forEach((cb) => cb(user));
  };

  const STORAGE_KEY = 'bw_google_user';

  const getCurrentUser = async (): Promise<AuthUser | null> => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  };

  const signUp = async (email: string, _password: string) => {
    return { error: new Error('Email signup not available with Google auth') };
  };

  const signIn = async (email: string, _password: string) => {
    return { error: new Error('Email signin not available with Google auth') };
  };

  const signInWithGoogle = async () => {
    try {
      // This will be handled by the Google OAuth component
      // For now, return no error - the actual Google flow will be handled in the UI
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem(STORAGE_KEY);
    notify(null);
  };

  const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
    listeners.add(callback);
    // Emit current state immediately
    getCurrentUser().then(callback);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        getCurrentUser().then((u) => callback(u));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(callback);
      window.removeEventListener('storage', onStorage);
    };
  };

  // Helper method to set user after successful Google sign-in
  const setUser = (user: AuthUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    notify(user);
  };

  return { 
    getCurrentUser, 
    signUp, 
    signIn, 
    signInWithGoogle, 
    signOut, 
    onAuthStateChange,
    // Expose setUser for Google OAuth component
    setUser 
  } as AuthService & { setUser: (user: AuthUser) => void };
};
