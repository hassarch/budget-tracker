import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SummaryCardsProps {
  income: number;
  expenses: number;
  balance: number;
  savingsRate: number;
}

export const SummaryCards = ({ income, expenses, balance, savingsRate }: SummaryCardsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      title: 'Total Balance',
      value: formatCurrency(balance),
      icon: Wallet,
      trend: balance >= 0 ? 'positive' : 'negative',
      description: 'Current month',
    },
    {
      title: 'Income',
      value: formatCurrency(income),
      icon: TrendingUp,
      trend: 'positive' as const,
      description: 'This month',
    },
    {
      title: 'Expenses',
      value: formatCurrency(expenses),
      icon: TrendingDown,
      trend: 'negative' as const,
      description: 'This month',
    },
    {
      title: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      icon: PiggyBank,
      trend: savingsRate >= 20 ? 'positive' : savingsRate >= 10 ? 'neutral' : 'negative',
      description: 'Of income saved',
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card 
          key={card.title} 
          className="glass shadow-card animate-fade-in overflow-hidden transition-all duration-300"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{card.title}</p>
                <p className={`text-[22px] md:text-[24px] leading-tight font-display font-semibold ${
                  card.title === 'Income' ? 'text-success' : card.title === 'Expenses' ? 'text-destructive' : 'text-foreground'
                }`}>
                  {card.value}
                </p>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-foreground/5 text-foreground/60 transition-colors">
                <card.icon className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
