import { AlertTriangle } from 'lucide-react';
import { Budget, CATEGORIES } from '@/types/budget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface BudgetProgressProps {
  budgets: Budget[];
}

export const BudgetProgress = ({ budgets }: BudgetProgressProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const sortedBudgets = [...budgets].sort((a, b) => {
    const aPercent = (a.spent / a.limit) * 100;
    const bPercent = (b.spent / b.limit) * 100;
    return bPercent - aPercent;
  });

  return (
    <Card className="glass shadow-card h-full">
      <CardHeader>
        <CardTitle className="text-lg font-display">Budget Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedBudgets.map((budget, index) => {
          const category = CATEGORIES[budget.category];
          const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
          const isOverBudget = budget.spent > budget.limit;
          const isNearLimit = percentage >= 80 && !isOverBudget;

          return (
            <div 
              key={budget.category} 
              className="space-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-sm font-medium">{category.name}</span>
                  {(isOverBudget || isNearLimit) && (
                    <AlertTriangle className={`h-4 w-4 ${isOverBudget ? 'text-destructive' : 'text-warning'}`} />
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                </span>
              </div>
              <div className="relative">
                <Progress 
                  value={percentage} 
                  className={`h-1.5 bg-muted rounded-full overflow-hidden ${
                    isOverBudget 
                      ? '[&>div]:bg-destructive/80' 
                      : isNearLimit 
                        ? '[&>div]:bg-warning/80' 
                        : '[&>div]:bg-foreground/40'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
