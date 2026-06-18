export type AppleHealthKitStatus = "not-configured" | "available" | "unavailable";

export async function getAppleHealthKitStatus(): Promise<AppleHealthKitStatus> {
  // Placeholder for a future Capacitor native plugin bridge.
  return "not-configured";
}
