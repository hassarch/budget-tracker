import { createLocalAuthService } from './auth/localAuthService';
import { createRealmAuthService } from './auth/realmAuthService';
import { createGoogleAuthService } from './auth/googleAuthService';
import type { AuthService } from './auth/types';
import { createLocalBudgetService } from './budget/localBudgetService';
import { createRealmBudgetService } from './budget/realmBudgetService';
import type { BudgetService } from './budget/types';

const provider = (import.meta.env.VITE_DATA_PROVIDER as string | undefined)?.toLowerCase() || 'local';

let authService: AuthService | null = null;
let budgetService: BudgetService | null = null;

export const getAuthService = (): AuthService => {
  if (authService) return authService;
  if (provider === 'realm') {
    authService = createRealmAuthService();
  } else if (provider === 'google') {
    authService = createGoogleAuthService();
  } else {
    authService = createLocalAuthService();
  }
  return authService;
};

export const getBudgetService = (): BudgetService => {
  if (budgetService) return budgetService;
  budgetService = provider === 'realm' ? createRealmBudgetService() : createLocalBudgetService();
  return budgetService;
};
