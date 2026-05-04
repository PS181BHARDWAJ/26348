import { loadDepotAndVehicleData } from "./api.js";
import { planForDepotBudget } from "./solver.js";

async function main() {
  try {
    const { depots, vehicles } = await loadDepotAndVehicleData();
    const plan = planForDepotBudget(depots, vehicles);
    console.log(JSON.stringify(plan, null, 2));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  }
}

void main();
