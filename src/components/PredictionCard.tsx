import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { Category, CATEGORIES } from '@/types/budget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Prediction {
  category: Category;
  predicted: number;
  trend: number;
}

interface PredictionCardProps {
  predictions: Prediction[];
  budgets: { category: Category; limit: number; spent: number }[];
}

export const PredictionCard = ({ predictions, budgets }: PredictionCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalPredicted = predictions.reduce((sum, p) => sum + p.predicted, 0);
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  
  const alerts = predictions.filter(p => {
    const budget = budgets.find(b => b.category === p.category);
    return budget && p.predicted > budget.limit * 0.9;
  });

  return (
    <Card className="glass shadow-card overflow-hidden">
      <CardHeader className="pb-3 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-display">Expense Predictor</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 rounded-xl bg-muted/50">
          <p className="text-sm text-muted-foreground mb-1">Predicted Monthly Spending</p>
          <p className="text-3xl font-display font-bold">{formatCurrency(totalPredicted)}</p>
          <p className="text-sm text-muted-foreground mt-1">
            of {formatCurrency(totalBudget)} budgeted
          </p>
        </div>

        {alerts.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-warning flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Budget Alerts
            </p>
            {alerts.map((alert, index) => {
              const category = CATEGORIES[alert.category];
              const budget = budgets.find(b => b.category === alert.category);
              
              return (
                <div 
                  key={alert.category}
                  className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <Badge variant="outline" className="border-warning text-warning">
                    ~{formatCurrency(alert.predicted)} expected
                  </Badge>
                </div>
              );
            })}
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Spending Trends</p>
          {predictions.slice(0, 4).map((prediction, index) => {
            const category = CATEGORIES[prediction.category];
            const isIncreasing = prediction.trend > 5;
            const isDecreasing = prediction.trend < -5;
            
            return (
              <div 
                key={prediction.category}
                className="flex items-center justify-between text-sm animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-2">
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{formatCurrency(prediction.predicted)}</span>
                  {isIncreasing && (
                    <TrendingUp className="h-4 w-4 text-destructive" />
                  )}
                  {isDecreasing && (
                    <TrendingDown className="h-4 w-4 text-success" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
