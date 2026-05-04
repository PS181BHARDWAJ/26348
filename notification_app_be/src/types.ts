export type NotificationType = "Placement" | "Event" | "Result";

export interface NotificationRecord {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
}

export interface NotificationResponse {
  notifications: NotificationRecord[];
}

export interface PrioritizedNotification extends NotificationRecord {
  priorityScore: number;
  parsedTimestamp: number;
}
