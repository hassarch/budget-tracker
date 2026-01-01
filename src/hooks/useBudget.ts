import { useState, useMemo, useEffect, useCallback } from 'react';
import { Transaction, Category, Budget } from '@/types/budget';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { getBudgetService } from '@/services/factory';

const DEFAULT_BUDGET_LIMITS: Record<Category, number> = {
  food: 500,
  transport: 300,
  entertainment: 200,
  shopping: 400,
  bills: 350,
  health: 150,
  education: 200,
  salary: 0,
  freelance: 0,
  investments: 0,
  other: 200,
};

export const useBudget = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch transactions from database
  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    const list = await getBudgetService().getTransactions(user.id);
    setTransactions(list);
  }, [user]);

  // Fetch budgets from database
  const fetchBudgets = useCallback(async () => {
    if (!user) return;
    const stored = await getBudgetService().getBudgetLimits(user.id);
    const expenseCategories: Category[] = ['food', 'transport', 'entertainment', 'shopping', 'bills', 'health', 'other'];
    const mergedBudgets: Budget[] = expenseCategories.map(category => ({
      category,
      limit: stored[category] ?? DEFAULT_BUDGET_LIMITS[category],
      spent: 0,
    }));
    setBudgets(mergedBudgets);
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTransactions(), fetchBudgets()]);
      setLoading(false);
    };

    if (user) {
      loadData();
    } else {
      setTransactions([]);
      setBudgets([]);
      setLoading(false);
    }
  }, [user, fetchTransactions, fetchBudgets]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!user) return;
    const newTransaction = await getBudgetService().addTransaction(user.id, transaction);
    setTransactions(prev => [newTransaction, ...prev]);
    toast.success('Transaction added successfully!');
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;
    await getBudgetService().deleteTransaction(user.id, id);
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast.success('Transaction deleted');
  };

  const updateBudget = async (category: Category, limit: number) => {
    if (!user) return;
    await getBudgetService().updateBudgetLimit(user.id, category, limit);
    setBudgets(prev => prev.map(b => b.category === category ? { ...b, limit } : b));
    toast.success('Budget updated');
  };

  const currentMonthTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter(t => 
      t.date.getMonth() === now.getMonth() && 
      t.date.getFullYear() === now.getFullYear()
    );
  }, [transactions]);

  const summary = useMemo(() => {
    const income = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income,
      expenses,
      balance: income - expenses,
      savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0,
    };
  }, [currentMonthTransactions]);

  const categorySpending = useMemo(() => {
    const spending: Record<string, number> = {};
    
    currentMonthTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        spending[t.category] = (spending[t.category] || 0) + t.amount;
      });
    
    return spending;
  }, [currentMonthTransactions]);

  const budgetsWithSpending = useMemo(() => {
    return budgets.map(b => ({
      ...b,
      spent: categorySpending[b.category] || 0,
    }));
  }, [budgets, categorySpending]);

  // Simple prediction based on past 3 months average
  const predictions = useMemo(() => {
    const now = new Date();
    const last3Months = transactions.filter(t => {
      const monthsAgo = (now.getFullYear() - t.date.getFullYear()) * 12 + 
                        (now.getMonth() - t.date.getMonth());
      return monthsAgo >= 0 && monthsAgo < 3 && t.type === 'expense';
    });

    const monthlyTotals: Record<string, number[]> = {};
    
    last3Months.forEach(t => {
      const key = t.category;
      if (!monthlyTotals[key]) monthlyTotals[key] = [];
      monthlyTotals[key].push(t.amount);
    });

    return Object.entries(monthlyTotals).map(([category, amounts]) => ({
      category: category as Category,
      predicted: amounts.reduce((a, b) => a + b, 0) / Math.max(amounts.length, 1),
      trend: amounts.length > 1 ? 
        (amounts[amounts.length - 1] - amounts[0]) / amounts[0] * 100 : 0,
    }));
  }, [transactions]);

  return {
    transactions,
    currentMonthTransactions,
    summary,
    budgets: budgetsWithSpending,
    categorySpending,
    predictions,
    loading,
    addTransaction,
    deleteTransaction,
    updateBudget,
  };
};
