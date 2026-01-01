import type { AuthService, AuthUser } from './types';

// Placeholder Realm (App Services) implementation.
// Requires: npm i realm-web and env VITE_REALM_APP_ID
// This file is scaffolded and not fully wired until App ID is provided.

export const createRealmAuthService = (): AuthService => {
  let initialized = false;
  // Lazy init to avoid importing realm-web if not used
  const ensureInit = async () => {
    if (initialized) return;
    const appId = import.meta.env.VITE_REALM_APP_ID as string | undefined;
    if (!appId) throw new Error('VITE_REALM_APP_ID not configured');
    // Dynamically import realm-web
    const { App } = await import('realm-web');
    // @ts-expect-error store on window for reuse
    if (!window.__realmApp) {
      // @ts-expect-error attach to window
      window.__realmApp = new App({ id: appId });
    }
    initialized = true;
  };

  const getApp = async (): Promise<any> => {
    await ensureInit();
    // @ts-expect-error read from window
    return window.__realmApp;
  };

  const mapUser = (u: any): AuthUser => ({ id: u.id, email: u.profile?.email ?? '' });

  return {
    getCurrentUser: async () => {
      const app = await getApp();
      const user = app.currentUser ?? null;
      return user ? mapUser(user) : null;
    },
    signUp: async (email: string, password: string) => {
      const app = await getApp();
      try {
        await app.emailPasswordAuth.registerUser({ email, password });
        // Immediately sign in
        const creds = app.credentials.emailPassword(email, password);
        const user = await app.logIn(creds);
        return { error: null };
      } catch (e: any) {
        return { error: e instanceof Error ? e : new Error(String(e)) };
      }
    },
    signIn: async (email: string, password: string) => {
      const app = await getApp();
      try {
        const creds = app.credentials.emailPassword(email, password);
        await app.logIn(creds);
        return { error: null };
      } catch (e: any) {
        return { error: e instanceof Error ? e : new Error(String(e)) };
      }
    },
    signInWithGoogle: async () => {
      const app = await getApp();
      try {
        const creds = app.credentials.google({ redirectUrl: window.location.origin + '/' });
        await app.logIn(creds);
        return { error: null };
      } catch (e: any) {
        return { error: e instanceof Error ? e : new Error(String(e)) };
      }
    },
    signOut: async () => {
      const app = await getApp();
      if (app.currentUser) await app.currentUser.logOut();
    },
    onAuthStateChange: (callback: (user: AuthUser | null) => void) => {
      // Realm doesn't have a dedicated listener in realm-web; we can poll or use window focus events.
      let cancelled = false;
      const tick = async () => {
        if (cancelled) return;
        try {
          const app = await getApp();
          const u = app.currentUser ? mapUser(app.currentUser) : null;
          callback(u);
        } catch {}
      };
      const interval = window.setInterval(tick, 1000);
      tick();
      return () => {
        cancelled = true;
        window.clearInterval(interval);
      };
    },
  };
};
