import type { BudgetService } from './types';
import type { Transaction, Category } from '@/types/budget';

export const createLocalBudgetService = (): BudgetService => {
  const txKey = (userId: string) => `bw_transactions_${userId}`;
  const bdKey = (userId: string) => `bw_budgets_${userId}`;

  return {
    async getTransactions(userId) {
      const raw = localStorage.getItem(txKey(userId));
      const list: Transaction[] = raw ? JSON.parse(raw) : [];
      return list.map(t => ({ ...t, date: new Date(t.date) }))
        .sort((a,b)=>b.date.getTime()-a.date.getTime());
    },
    async addTransaction(userId, tx) {
      const raw = localStorage.getItem(txKey(userId));
      const list: Transaction[] = raw ? JSON.parse(raw) : [];
      const newTx: Transaction = { id: crypto.randomUUID(), ...tx } as Transaction;
      const updated = [newTx, ...list];
      localStorage.setItem(txKey(userId), JSON.stringify(updated));
      return newTx;
    },
    async deleteTransaction(userId, id) {
      const raw = localStorage.getItem(txKey(userId));
      const list: Transaction[] = raw ? JSON.parse(raw) : [];
      const updated = list.filter(t => t.id !== id);
      localStorage.setItem(txKey(userId), JSON.stringify(updated));
    },

    async getBudgetLimits(userId) {
      const raw = localStorage.getItem(bdKey(userId));
      return raw ? JSON.parse(raw) : {} as Record<Category, number>;
    },
    async updateBudgetLimit(userId, category, limit) {
      const raw = localStorage.getItem(bdKey(userId));
      const stored: Record<Category, number> = raw ? JSON.parse(raw) : {} as any;
      stored[category] = limit;
      localStorage.setItem(bdKey(userId), JSON.stringify(stored));
    },
  };
};
