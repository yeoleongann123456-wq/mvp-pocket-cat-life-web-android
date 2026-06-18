import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mochi.catcare",
  appName: "Mochi",
  webDir: "dist",
  server: {
    androidScheme: "https"
  }
};

export default config;
