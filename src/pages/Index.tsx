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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero bar */}
        <section className="relative mb-8 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
          {/* Background floaters in hero */}
          <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            {/* Scattered, lighter floaters only on dashboard */}
            <div className="absolute top-[6%] left-[6%] text-3xl opacity-10 animate-float" style={{ animationDuration: '8s' }}>₹</div>
            <div className="absolute top-[10%] left-[28%] text-2xl opacity-15 animate-float" style={{ animationDuration: '9s', animationDelay: '0.2s' }}>💸</div>
            <div className="absolute top-[4%] right-[8%] text-4xl opacity-10 animate-float" style={{ animationDuration: '10s', animationDelay: '0.4s' }}>₹</div>

            <div className="absolute top-[22%] left-[10%] text-2xl opacity-15 animate-float" style={{ animationDuration: '11s', animationDelay: '0.6s' }}>💸</div>
            <div className="absolute top-[26%] right-[26%] text-3xl opacity-10 animate-float" style={{ animationDuration: '12s', animationDelay: '0.8s' }}>₹</div>
            <div className="absolute top-[18%] right-[14%] text-2xl opacity-15 animate-float" style={{ animationDuration: '9.5s', animationDelay: '0.5s' }}>💸</div>

            <div className="absolute bottom-[20%] left-[12%] text-3xl opacity-10 animate-float" style={{ animationDuration: '10.5s', animationDelay: '0.9s' }}>₹</div>
            <div className="absolute bottom-[14%] left-[32%] text-2xl opacity-15 animate-float" style={{ animationDuration: '9s', animationDelay: '1.1s' }}>💸</div>
            <div className="absolute bottom-[10%] right-[22%] text-4xl opacity-10 animate-float" style={{ animationDuration: '11.5s', animationDelay: '0.7s' }}>₹</div>
            <div className="absolute bottom-[18%] right-[8%] text-2xl opacity-15 animate-float" style={{ animationDuration: '12.5s', animationDelay: '1.2s' }}>💸</div>
          </div>
          <div className="bg-secondary border-b border-border/70 animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-foreground/5 text-foreground/60">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-[24px] md:text-[26px] font-display font-semibold tracking-[-0.015em]">Expenso</h1>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <AddTransactionDialog onAdd={addTransaction} />
                  <Button variant="outline" size="icon" onClick={signOut}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

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
