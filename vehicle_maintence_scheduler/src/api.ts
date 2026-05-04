import type { Depot, DepotResponse, VehicleResponse, VehicleTask } from "./types.js";

const runtime = globalThis as typeof globalThis & {
  process?: { env?: Record<string, string | undefined> };
};

function readEnv(name: string): string | undefined {
  return runtime.process?.env?.[name];
}

function normalizeInteger(value: number, label: string): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be a non-negative finite number`);
  }

  return Math.floor(value);
}

async function fetchProtectedJson<T>(url: string, token: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    const bodyText = await response.text();
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText} ${bodyText}`.trim());
  }

  return (await response.json()) as T;
}

function extractDepots(payload: DepotResponse | Depot[] | { data: DepotResponse | Depot[] }): Depot[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if ("depots" in payload && Array.isArray(payload.depots)) {
    return payload.depots;
  }

  if ("data" in payload) {
    return extractDepots(payload.data);
  }

  throw new Error("Unexpected depot response shape");
}

function extractVehicles(payload: VehicleResponse | VehicleTask[] | { data: VehicleResponse | VehicleTask[] }): VehicleTask[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if ("vehicles" in payload && Array.isArray(payload.vehicles)) {
    return payload.vehicles;
  }

  if ("data" in payload) {
    return extractVehicles(payload.data);
  }

  throw new Error("Unexpected vehicle response shape");
}

export async function loadDepotAndVehicleData(): Promise<{ depots: Depot[]; vehicles: VehicleTask[] }> {
  const baseUrl = readEnv("EVALUATION_SERVICE_BASE_URL") ?? "http://20.207.122.201/evaluation-service";
  const token = readEnv("EVALUATION_SERVICE_TOKEN") ?? readEnv("AUTH_TOKEN");

  if (!token) {
    console.warn("No EVALUATION_SERVICE_TOKEN or AUTH_TOKEN found — using local mock data for depots and vehicles.");
    const mockDepots: Depot[] = [
      { ID: 1, MechanicHours: 60 },
      { ID: 2, MechanicHours: 135 },
      { ID: 3, MechanicHours: 188 }
    ];

    const mockVehicles: VehicleTask[] = [
      { TaskID: "task-1", Duration: 2, Impact: 5 },
      { TaskID: "task-2", Duration: 6, Impact: 2 },
      { TaskID: "task-3", Duration: 1, Impact: 3 },
      { TaskID: "task-4", Duration: 5, Impact: 5 },
      { TaskID: "task-5", Duration: 7, Impact: 3 }
    ];

    return { depots: mockDepots, vehicles: mockVehicles };
  }

  const [depotPayload, vehiclePayload] = await Promise.all([
    fetchProtectedJson<DepotResponse | Depot[] | { data: DepotResponse | Depot[] }>(`${baseUrl}/depots`, token),
    fetchProtectedJson<VehicleResponse | VehicleTask[] | { data: VehicleResponse | VehicleTask[] }>(`${baseUrl}/vehicles`, token)
  ]);

  return {
    depots: extractDepots(depotPayload),
    vehicles: extractVehicles(vehiclePayload)
  };
}

export function normalizeMechanicHours(value: number, label: string): number {
  return normalizeInteger(value, label);
}
