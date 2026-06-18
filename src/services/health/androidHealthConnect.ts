export type AndroidHealthConnectStatus = "not-configured" | "available" | "unavailable";

export async function getAndroidHealthConnectStatus(): Promise<AndroidHealthConnectStatus> {
  // Placeholder for a future Capacitor native plugin bridge.
  return "not-configured";
}
