import type { BudgetService } from './types';
import type { Transaction, Category } from '@/types/budget';

// Placeholder implementation using Realm-Web (MongoDB Atlas App Services)
// This scaffolds collection names and expected schema.
// Collections: transactions, budgets

const COLLECTIONS = {
  transactions: 'transactions',
  budgets: 'budgets',
};

export const createRealmBudgetService = (): BudgetService => {
  const ensureApp = async () => {
    const appId = import.meta.env.VITE_REALM_APP_ID as string | undefined;
    if (!appId) throw new Error('VITE_REALM_APP_ID not configured');
    const { App, Credentials } = await import('realm-web');
    // @ts-expect-error attach to window
    if (!window.__realmApp) {
      // @ts-expect-error attach to window
      window.__realmApp = new App({ id: appId });
    }
    // @ts-expect-error
    const app = window.__realmApp as any;
    if (!app.currentUser) {
      // Anonymous login as placeholder; replace with authenticated user flow
      try {
        const creds = Credentials.anonymous();
        await app.logIn(creds);
      } catch {}
    }
    return app as any;
  };

  const getMongo = async () => {
    const app = await ensureApp();
    const mongo = app.currentUser.mongoClient('mongodb-atlas');
    const dbName = import.meta.env.VITE_MONGO_DB_NAME as string | undefined;
    if (!dbName) throw new Error('VITE_MONGO_DB_NAME not configured');
    const db = mongo.db(dbName);
    return { db };
  };

  return {
    async getTransactions(userId: string) {
      const { db } = await getMongo();
      const docs = await db.collection(COLLECTIONS.transactions)
        .find({ userId }, { sort: { date: -1 } });
      return docs.map((d: any) => ({
        id: d._id?.toString?.() ?? d.id,
        type: d.type,
        amount: Number(d.amount),
        category: d.category,
        description: d.description ?? '',
        date: new Date(d.date),
      })) as Transaction[];
    },
    async addTransaction(userId: string, tx: Omit<Transaction, 'id'>) {
      const { db } = await getMongo();
      const doc = { ...tx, userId, date: tx.date.toISOString() };
      const res = await db.collection(COLLECTIONS.transactions).insertOne(doc);
      return { id: res.insertedId?.toString?.() ?? crypto.randomUUID(), ...tx } as Transaction;
    },
    async deleteTransaction(userId: string, id: string) {
      const { db } = await getMongo();
      await db.collection(COLLECTIONS.transactions).deleteOne({ _id: { $oid: id } as any, userId });
    },
    async getBudgetLimits(userId: string) {
      const { db } = await getMongo();
      const docs = await db.collection(COLLECTIONS.budgets).find({ userId });
      const map: Record<Category, number> = {} as any;
      for (const d of docs) {
        map[d.category as Category] = Number(d.limit ?? d.budget_limit ?? 0);
      }
      return map;
    },
    async updateBudgetLimit(userId: string, category: Category, limit: number) {
      const { db } = await getMongo();
      await db.collection(COLLECTIONS.budgets).updateOne(
        { userId, category },
        { $set: { limit } },
        { upsert: true }
      );
    },
  };
};
