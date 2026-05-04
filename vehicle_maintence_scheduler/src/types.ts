export interface Depot {
  ID: number;
  MechanicHours: number;
}

export interface VehicleTask {
  TaskID: string;
  Duration: number;
  Impact: number;
}

export interface DepotResponse {
  depots: Depot[];
}

export interface VehicleResponse {
  vehicles: VehicleTask[];
}

export interface MaintenancePlan {
  budgetHours: number;
  totalImpact: number;
  totalDuration: number;
  selectedTasks: VehicleTask[];
}
