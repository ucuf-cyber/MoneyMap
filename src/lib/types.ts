export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: "expense" | "income";
  isDefault: boolean;
};

export type Transaction = {
  id: string;
  type: "expense" | "income";
  amount: number;
  date: string;
  note: string | null;
  method: "cash" | "ewallet" | "transfer" | "card";
  categoryId: string | null;
  category: Category | null;
};

export type SavingsContribution = {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  note: string | null;
};

export type SavingsGoal = {
  id: string;
  name: string;
  icon: string;
  color: string;
  targetAmount: number;
  currentAmount: number;
  autoSplitPct: number;
  targetDate: string | null;
  isWeddingGoal: boolean;
  contributions: SavingsContribution[];
};

export type WeddingVendor = {
  id: string;
  name: string;
  contact: string | null;
  notes: string | null;
};

export type WeddingBudgetItem = {
  id: string;
  category: string;
  estimatedCost: number;
  actualCost: number;
  paidAmount: number;
  dueDate: string | null;
  notes: string | null;
  vendorId: string | null;
  vendor: WeddingVendor | null;
};

export type WeddingGiftItem = {
  id: string;
  name: string;
  price: number;
  storeLink: string | null;
  notes: string | null;
  isPurchased: boolean;
};

export type Reminder = {
  id: string;
  title: string;
  amount: number | null;
  dueDate: string | null;
  isDone: boolean;
};

export type MonthlyReport = {
  key: string;
  label: string;
  income: number;
  expense: number;
  savings: number;
};

export type ReportsResponse = {
  months: MonthlyReport[];
  categoryBreakdown: { name: string; color: string; total: number }[];
  insights: string[];
};
