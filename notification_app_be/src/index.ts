import { fetchNotificationsFromApi, getTopNotifications } from "./service.js";

async function main() {
  try {
    const notifications = await fetchNotificationsFromApi();
    const topNotifications = getTopNotifications(notifications, 10);
    console.log(JSON.stringify(topNotifications, null, 2));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  }
}

void main();
