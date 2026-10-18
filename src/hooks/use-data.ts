"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Category, Reminder, SavingsGoal, Transaction, WeddingBudgetItem, WeddingGiftItem } from "@/lib/types";

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: api.categories.list });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Category>) => api.categories.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => api.categories.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.categories.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useTransactions(params?: Record<string, string>) {
  return useQuery({ queryKey: ["transactions", params], queryFn: () => api.transactions.list(params) });
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Transaction>) => api.transactions.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["reports"] });
      qc.invalidateQueries({ queryKey: ["savingsGoals"] });
      qc.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
}

export function useUpdateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Transaction> }) => api.transactions.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.transactions.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}

export function useSavingsGoals() {
  return useQuery({ queryKey: ["savingsGoals"], queryFn: api.savingsGoals.list });
}

export function useCreateSavingsGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SavingsGoal>) => api.savingsGoals.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["savingsGoals"] }),
  });
}

export function useUpdateSavingsGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SavingsGoal> }) => api.savingsGoals.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["savingsGoals"] }),
  });
}

export function useDeleteSavingsGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.savingsGoals.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["savingsGoals"] }),
  });
}

export function useContributeSavingsGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, amount, note }: { id: string; amount: number; note?: string }) =>
      api.savingsGoals.contribute(id, amount, note),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["savingsGoals"] }),
  });
}

export function useWeddingItems() {
  return useQuery({ queryKey: ["weddingItems"], queryFn: api.wedding.items.list });
}

export function useCreateWeddingItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<WeddingBudgetItem>) => api.wedding.items.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["weddingItems"] }),
  });
}

export function useUpdateWeddingItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WeddingBudgetItem> }) =>
      api.wedding.items.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["weddingItems"] }),
  });
}

export function useDeleteWeddingItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.wedding.items.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["weddingItems"] }),
  });
}

export function useWeddingVendors() {
  return useQuery({ queryKey: ["weddingVendors"], queryFn: api.wedding.vendors.list });
}

export function useCreateWeddingVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string }) => api.wedding.vendors.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["weddingVendors"] }),
  });
}

export function useWeddingGifts() {
  return useQuery({ queryKey: ["weddingGifts"], queryFn: api.wedding.gifts.list });
}

export function useCreateWeddingGift() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<WeddingGiftItem>) => api.wedding.gifts.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["weddingGifts"] }),
  });
}

export function useUpdateWeddingGift() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WeddingGiftItem> }) => api.wedding.gifts.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["weddingGifts"] }),
  });
}

export function useDeleteWeddingGift() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.wedding.gifts.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["weddingGifts"] }),
  });
}

export function useReminders() {
  return useQuery({ queryKey: ["reminders"], queryFn: api.reminders.list });
}

export function useCreateReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Reminder>) => api.reminders.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminders"] }),
  });
}

export function useUpdateReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Reminder> }) => api.reminders.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminders"] }),
  });
}

export function useDeleteReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.reminders.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminders"] }),
  });
}

export function useReports() {
  return useQuery({ queryKey: ["reports"], queryFn: api.reports.get });
}
