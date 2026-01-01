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
      currency: 'USD',
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
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card 
          key={card.title} 
          className="glass shadow-card animate-slide-up overflow-hidden group hover:shadow-glow transition-all duration-300"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <p className={`text-2xl font-display font-bold ${
                  card.trend === 'positive' ? 'text-success' : 
                  card.trend === 'negative' ? 'text-destructive' : 
                  'text-foreground'
                }`}>
                  {card.value}
                </p>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </div>
              <div className={`p-3 rounded-xl ${
                card.trend === 'positive' ? 'bg-success/10' : 
                card.trend === 'negative' ? 'bg-destructive/10' : 
                'bg-muted'
              } group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className={`w-5 h-5 ${
                  card.trend === 'positive' ? 'text-success' : 
                  card.trend === 'negative' ? 'text-destructive' : 
                  'text-muted-foreground'
                }`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
