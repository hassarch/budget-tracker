import { useState, useMemo, useEffect, useCallback } from 'react';
import { Transaction, Category, Budget } from '@/types/budget';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

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
    
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
      return;
    }

    const mappedTransactions: Transaction[] = data.map(t => ({
      id: t.id,
      type: t.type as 'income' | 'expense',
      amount: Number(t.amount),
      category: t.category as Category,
      description: t.description || '',
      date: new Date(t.date),
    }));

    setTransactions(mappedTransactions);
  }, [user]);

  // Fetch budgets from database
  const fetchBudgets = useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('budgets')
      .select('*');

    if (error) {
      console.error('Error fetching budgets:', error);
      return;
    }

    // Merge database budgets with defaults
    const expenseCategories: Category[] = ['food', 'transport', 'entertainment', 'shopping', 'bills', 'health', 'other'];
    const budgetMap = new Map(data.map(b => [b.category, Number(b.budget_limit)]));
    
    const mergedBudgets: Budget[] = expenseCategories.map(category => ({
      category,
      limit: budgetMap.get(category) ?? DEFAULT_BUDGET_LIMITS[category],
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

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        date: transaction.date.toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
      return;
    }

    const newTransaction: Transaction = {
      id: data.id,
      type: data.type as 'income' | 'expense',
      amount: Number(data.amount),
      category: data.category as Category,
      description: data.description || '',
      date: new Date(data.date),
    };

    setTransactions(prev => [newTransaction, ...prev]);
    toast.success('Transaction added successfully!');
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
      return;
    }

    setTransactions(prev => prev.filter(t => t.id !== id));
    toast.success('Transaction deleted');
  };

  const updateBudget = async (category: Category, limit: number) => {
    if (!user) return;

    const { error } = await supabase
      .from('budgets')
      .upsert({
        user_id: user.id,
        category,
        budget_limit: limit,
      }, { onConflict: 'user_id,category' });

    if (error) {
      console.error('Error updating budget:', error);
      toast.error('Failed to update budget');
      return;
    }

    setBudgets(prev => 
      prev.map(b => b.category === category ? { ...b, limit } : b)
    );
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
