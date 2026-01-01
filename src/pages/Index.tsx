import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, LogOut } from 'lucide-react';
import { useBudget } from '@/hooks/useBudget';
import { useAuth } from '@/hooks/useAuth';
import { SummaryCards } from '@/components/SummaryCards';
import { TransactionList } from '@/components/TransactionList';
import { AddTransactionDialog } from '@/components/AddTransactionDialog';
import { SpendingChart } from '@/components/SpendingChart';
import { BudgetProgress } from '@/components/BudgetProgress';
import { PredictionCard } from '@/components/PredictionCard';
import { MonthlyTrend } from '@/components/MonthlyTrend';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  
  const {
    transactions,
    currentMonthTransactions,
    summary,
    budgets,
    categorySpending,
    predictions,
    loading: budgetLoading,
    addTransaction,
    deleteTransaction,
  } = useBudget();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || budgetLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl gradient-primary shadow-glow">
              <Wallet className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">BudgetWise</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AddTransactionDialog onAdd={addTransaction} />
            <Button variant="outline" size="icon" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Summary Cards */}
        <section className="mb-8">
          <SummaryCards
            income={summary.income}
            expenses={summary.expenses}
            balance={summary.balance}
            savingsRate={summary.savingsRate}
          />
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            <MonthlyTrend transactions={transactions} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SpendingChart categorySpending={categorySpending} />
              <BudgetProgress budgets={budgets} />
            </div>
          </div>

          {/* Right Column - Transactions & Predictions */}
          <div className="space-y-6">
            <PredictionCard predictions={predictions} budgets={budgets} />
            <TransactionList
              transactions={currentMonthTransactions}
              onDelete={deleteTransaction}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground py-4">
          <p>Track smarter. Spend wiser. Save more.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
