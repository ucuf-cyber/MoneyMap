import type {
  Category,
  Transaction,
  SavingsGoal,
  WeddingBudgetItem,
  WeddingVendor,
  WeddingGiftItem,
  Reminder,
  ReportsResponse,
} from "@/lib/types";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? "Terjadi kesalahan");
  }
  return res.json();
}

export const api = {
  categories: {
    list: () => request<Category[]>("/api/categories"),
    create: (data: Partial<Category>) =>
      request<Category>("/api/categories", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Category>) =>
      request<Category>(`/api/categories/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    remove: (id: string) => request(`/api/categories/${id}`, { method: "DELETE" }),
  },
  transactions: {
    list: (params?: Record<string, string>) =>
      request<Transaction[]>(`/api/transactions${params ? `?${new URLSearchParams(params)}` : ""}`),
    create: (data: Partial<Transaction>) =>
      request<Transaction>("/api/transactions", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Transaction>) =>
      request<Transaction>(`/api/transactions/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    remove: (id: string) => request(`/api/transactions/${id}`, { method: "DELETE" }),
  },
  savingsGoals: {
    list: () => request<SavingsGoal[]>("/api/savings-goals"),
    create: (data: Partial<SavingsGoal>) =>
      request<SavingsGoal>("/api/savings-goals", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<SavingsGoal>) =>
      request<SavingsGoal>(`/api/savings-goals/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    remove: (id: string) => request(`/api/savings-goals/${id}`, { method: "DELETE" }),
    contribute: (id: string, amount: number, note?: string) =>
      request<SavingsGoal>(`/api/savings-goals/${id}/contribute`, {
        method: "POST",
        body: JSON.stringify({ amount, note }),
      }),
  },
  wedding: {
    items: {
      list: () => request<WeddingBudgetItem[]>("/api/wedding/items"),
      create: (data: Partial<WeddingBudgetItem>) =>
        request<WeddingBudgetItem>("/api/wedding/items", { method: "POST", body: JSON.stringify(data) }),
      update: (id: string, data: Partial<WeddingBudgetItem>) =>
        request<WeddingBudgetItem>(`/api/wedding/items/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
      remove: (id: string) => request(`/api/wedding/items/${id}`, { method: "DELETE" }),
    },
    vendors: {
      list: () => request<WeddingVendor[]>("/api/wedding/vendors"),
      create: (data: Partial<WeddingVendor>) =>
        request<WeddingVendor>("/api/wedding/vendors", { method: "POST", body: JSON.stringify(data) }),
    },
    gifts: {
      list: () => request<WeddingGiftItem[]>("/api/wedding/gifts"),
      create: (data: Partial<WeddingGiftItem>) =>
        request<WeddingGiftItem>("/api/wedding/gifts", { method: "POST", body: JSON.stringify(data) }),
      update: (id: string, data: Partial<WeddingGiftItem>) =>
        request<WeddingGiftItem>(`/api/wedding/gifts/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
      remove: (id: string) => request(`/api/wedding/gifts/${id}`, { method: "DELETE" }),
    },
  },
  reminders: {
    list: () => request<Reminder[]>("/api/reminders"),
    create: (data: Partial<Reminder>) =>
      request<Reminder>("/api/reminders", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Reminder>) =>
      request<Reminder>(`/api/reminders/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    remove: (id: string) => request(`/api/reminders/${id}`, { method: "DELETE" }),
  },
  reports: {
    get: () => request<ReportsResponse>("/api/reports"),
  },
};
