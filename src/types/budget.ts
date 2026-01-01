export type TransactionType = 'income' | 'expense';

export type Category = 
  | 'salary'
  | 'freelance'
  | 'investments'
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'shopping'
  | 'bills'
  | 'health'
  | 'education'
  | 'other';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  description: string;
  date: Date;
}

export interface Budget {
  category: Category;
  limit: number;
  spent: number;
}

export interface CategoryInfo {
  name: string;
  icon: string;
  color: string;
}

export const CATEGORIES: Record<Category, CategoryInfo> = {
  salary: { name: 'Salary', icon: '💰', color: 'hsl(160, 84%, 39%)' },
  freelance: { name: 'Freelance', icon: '💼', color: 'hsl(200, 80%, 50%)' },
  investments: { name: 'Investments', icon: '📈', color: 'hsl(280, 65%, 60%)' },
  food: { name: 'Food & Dining', icon: '🍔', color: 'hsl(38, 92%, 50%)' },
  transport: { name: 'Transport', icon: '🚗', color: 'hsl(200, 80%, 50%)' },
  entertainment: { name: 'Entertainment', icon: '🎬', color: 'hsl(320, 70%, 50%)' },
  shopping: { name: 'Shopping', icon: '🛍️', color: 'hsl(280, 65%, 60%)' },
  bills: { name: 'Bills & Utilities', icon: '📱', color: 'hsl(0, 72%, 51%)' },
  health: { name: 'Health', icon: '🏥', color: 'hsl(160, 84%, 39%)' },
  education: { name: 'Education', icon: '📚', color: 'hsl(200, 80%, 50%)' },
  other: { name: 'Other', icon: '📦', color: 'hsl(220, 10%, 50%)' },
};
