import type { Depot, MaintenancePlan, VehicleTask } from "./types.js";
import { normalizeMechanicHours } from "./api.js";

function normalizeInteger(value: number, label: string): number {
  return normalizeMechanicHours(value, label);
}

export function solveMaintenanceSchedule(tasks: VehicleTask[], budgetHours: number): MaintenancePlan {
  const budget = normalizeInteger(budgetHours, "budgetHours");
  const normalizedTasks = tasks.map((task) => ({
    ...task,
    Duration: normalizeInteger(task.Duration, `Task ${task.TaskID} duration`),
    Impact: normalizeInteger(task.Impact, `Task ${task.TaskID} impact`)
  }));

  const scores = new Array<number>(budget + 1).fill(0);
  const choices = Array.from({ length: normalizedTasks.length + 1 }, () => new Uint8Array(budget + 1));

  for (let i = 1; i <= normalizedTasks.length; i++) {
    const task = normalizedTasks[i - 1];
    const duration = task.Duration;
    const impact = task.Impact;

    for (let capacity = budget; capacity >= duration; capacity--) {
      const candidateScore = scores[capacity - duration] + impact;
      if (candidateScore > scores[capacity]) {
        scores[capacity] = candidateScore;
        choices[i][capacity] = 1;
      }
    }
  }

  const selectedTasks: VehicleTask[] = [];
  let remainingCapacity = budget;

  for (let i = normalizedTasks.length; i >= 1; i--) {
    if (choices[i][remainingCapacity] === 1) {
      const task = normalizedTasks[i - 1];
      selectedTasks.push(task);
      remainingCapacity -= task.Duration;
    }
  }

  selectedTasks.reverse();

  const totalDuration = selectedTasks.reduce((sum, task) => sum + task.Duration, 0);
  const totalImpact = selectedTasks.reduce((sum, task) => sum + task.Impact, 0);

  return {
    budgetHours: budget,
    totalImpact,
    totalDuration,
    selectedTasks
  };
}

export function planForDepotBudget(depots: Depot[], tasks: VehicleTask[]): MaintenancePlan {
  const totalBudget = depots.reduce((sum, depot) => sum + normalizeInteger(depot.MechanicHours, `Depot ${depot.ID} mechanic hours`), 0);
  return solveMaintenanceSchedule(tasks, totalBudget);
}
