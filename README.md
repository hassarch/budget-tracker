# Expenso - Smart Budget Tracking & Expense Prediction

A modern, intelligent budget tracking application built with React, TypeScript, and Vite. Track expenses, visualize spending patterns, and predict future costs with AI-powered insights.

## 🚀 Features

- **Google OAuth Authentication** - Secure sign-in with Google account
- **Expense Tracking** - Add, categorize, and manage transactions
- **Budget Management** - Set and track spending limits by category
- **Visual Analytics** - Interactive charts and spending insights
- **AI Predictions** - Predict future expenses based on historical data
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Dark Mode** - Built-in dark/light theme support

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Radix UI + Tailwind CSS + shadcn/ui
- **Charts**: Recharts for data visualization
- **State Management**: React Query + Context API
- **Authentication**: Google OAuth 2.0 with @react-oauth/google
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or bun

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd budget-buddy-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   # Google OAuth Configuration
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   
   # Data Provider (local, realm, google)
   VITE_DATA_PROVIDER=google
   ```

4. **Google OAuth Setup**
   
   a. Go to [Google Cloud Console](https://console.cloud.google.com/)
   b. Create a new project or select existing one
   c. Enable Google+ API
   d. Create OAuth 2.0 credentials:
      - Select "Web application"
      - Add authorized redirect URIs:
        - `http://localhost:8080` (development)
        - `https://yourdomain.com` (production)
   e. Copy the Client ID to your `.env` file

5. **Start development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Open application**
   - Navigate to `http://localhost:8080`
   - Sign in with Google to get started

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/            # shadcn/ui components
│   └── auth/           # Authentication components
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx     # Authentication state
│   └── useBudget.ts     # Budget data management
├── pages/              # Route components
│   ├── Index.tsx        # Main dashboard
│   ├── Auth.tsx         # Login/register page
│   └── NotFound.tsx      # 404 page
├── services/           # Business logic
│   ├── auth/            # Authentication services
│   │   ├── types.ts
│   │   ├── localAuthService.ts
│   │   ├── googleAuthService.ts
│   │   └── realmAuthService.ts
│   ├── budget/          # Budget data services
│   │   ├── types.ts
│   │   ├── localBudgetService.ts
│   │   └── realmBudgetService.ts
│   └── factory.ts        # Service factory pattern
├── types/              # TypeScript type definitions
└── lib/               # Utility functions
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | - | Yes (for Google auth) |
| `VITE_DATA_PROVIDER` | Auth provider (local, realm, google) | `local` | No |

### Authentication Providers

#### Local (Default)
- Email/password authentication
- Data stored in localStorage
- No external dependencies

#### Google OAuth
- Secure OAuth 2.0 flow
- User data from Google profile
- Requires Google Cloud setup

#### Realm (MongoDB)
- Production-ready authentication
- MongoDB integration
- Real-time data sync

## 📊 Data Models

### Transaction
```typescript
interface Transaction {
  id: string;
  date: Date;
  categoryId: string;
  amount: number;
  note?: string;
  type: 'expense' | 'income';
}
```

### Budget
```typescript
interface Budget {
  category: Category;
  limit: number;
  spent: number;
}
```

### Categories
- **Expenses**: food, transport, entertainment, shopping, bills, health, other
- **Income**: salary, freelance, investments, other

## 🎯 Usage

### 1. Authentication
- Visit `/auth` to sign in
- Use Google OAuth for quick access
- Or use email/password (local provider)

### 2. Tracking Expenses
- Add transactions from the dashboard
- Categorize automatically
- Add notes for context

### 3. Budget Management
- Set monthly limits per category
- Track progress visually
- Get alerts when approaching limits

### 4. Analytics
- View spending charts
- Analyze trends
- Export data for external analysis

### 5. Predictions
- AI-powered expense forecasting
- Based on historical patterns
- Helps with financial planning

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Setup
1. Set production environment variables
2. Configure domain in Google OAuth
3. Deploy to your preferred platform

### Deployment Platforms
- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- **Docker**

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Maintain component consistency
- Test thoroughly

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check existing documentation
- Review troubleshooting guide

## 🔄 Updates

### Version History
- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added Google OAuth integration

---


