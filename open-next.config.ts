import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  // R2 incremental cache for ISR (gallery page uses revalidate: 60)
  incrementalCache: r2IncrementalCache,
});
