import { defineCloudflareConfig } from "@opennextjs/cloudflare";
// Uncomment if you want to use R2 for incremental cache
// import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  // Uncomment if you want to use R2 for incremental cache
  // incrementalCache: r2IncrementalCache,
});
