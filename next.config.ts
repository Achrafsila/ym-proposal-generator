import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @sparticuz/chromium and puppeteer-core must run via native Node
  // `require`, not be bundled by the Server Components compiler.
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],

  // @sparticuz/chromium reads its brotli-compressed Chromium binary from its
  // own `bin/` folder at runtime (not via a static `require`/`import`), so
  // Next's output file tracing doesn't discover it on its own — confirmed by
  // the Vercel runtime error "input directory .../bin does not exist".
  // Route key is the route path (e.g. "/api/hello"), matching
  // app/api/generate-pdf/route.ts.
  outputFileTracingIncludes: {
    "/api/generate-pdf": ["./node_modules/@sparticuz/chromium/bin/**/*"],
  },
};

export default nextConfig;
