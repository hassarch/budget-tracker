import type { Transaction, Category, Budget } from '@/types/budget';

export interface BudgetService {
  getTransactions(userId: string): Promise<Transaction[]>;
  addTransaction(userId: string, tx: Omit<Transaction, 'id'>): Promise<Transaction>;
  deleteTransaction(userId: string, id: string): Promise<void>;

  getBudgetLimits(userId: string): Promise<Record<Category, number>>;
  updateBudgetLimit(userId: string, category: Category, limit: number): Promise<void>;
}
