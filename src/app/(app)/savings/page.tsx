"use client";

import { GoalCard } from "@/components/savings/goal-card";
import { CreateGoalDialog } from "@/components/savings/create-goal-dialog";
import { SavingsSimulator } from "@/components/savings/savings-simulator";
import { PageTransition } from "@/components/motion/page-transition";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { useSavingsGoals } from "@/hooks/use-data";

export default function SavingsPage() {
  const { data: goals = [], isLoading } = useSavingsGoals();

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tabungan & Goal</h1>
            <p className="text-sm text-muted-foreground">Rencanakan dan pantau progress goal tabunganmu.</p>
          </div>
          <CreateGoalDialog />
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Memuat goal...</p>
        ) : (
          <StaggerGrid className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {goals.map((goal) => (
              <StaggerItem key={goal.id}>
                <GoalCard goal={goal} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}

        <SavingsSimulator goals={goals} />
      </div>
    </PageTransition>
  );
}
