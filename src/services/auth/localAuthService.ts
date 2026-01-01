import type { AuthService, AuthUser } from './types';

const STORAGE_KEY = 'bw_user';

export const createLocalAuthService = (): AuthService => {
  let listeners = new Set<(user: AuthUser | null) => void>();
  const notify = (user: AuthUser | null) => {
    listeners.forEach((cb) => cb(user));
  };

  const getCurrentUser = async (): Promise<AuthUser | null> => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  };

  const signUp = async (email: string, _password: string) => {
    const user: AuthUser = { id: email, email };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    notify(user);
    return { error: null };
  };

  const signIn = async (email: string, _password: string) => {
    const user: AuthUser = { id: email, email };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    notify(user);
    return { error: null };
  };

  const signInWithGoogle = async () => {
    return { error: new Error('Google sign-in not available in local mode') };
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

  return { getCurrentUser, signUp, signIn, signInWithGoogle, signOut, onAuthStateChange };
};
