import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import puppeteer from "puppeteer-core";
import type { Browser } from "puppeteer-core";

import { buildDocumentData } from "@/lib/build-document-data";
import { buildProposalFilename } from "@/lib/filename";
import { proposalSchema } from "@/lib/proposal-schema";
import { renderProposalHtml } from "@/lib/render-proposal-html";

// Must run on the Node.js runtime (not Edge) — Puppeteer needs Node APIs
// (child_process, fs) to launch and drive a real Chromium process.
export const runtime = "nodejs";

// A cold Chromium launch + render + page.pdf() comfortably exceeds most
// platform defaults. 60s stays within both Vercel Hobby's and Pro's limits.
export const maxDuration = 60;

// Vercel sets VERCEL="1" at both build and runtime, on every plan — the
// documented, reliable way to distinguish "running on Vercel" from local
// development or any other host.
const IS_VERCEL = process.env.VERCEL === "1";

function log(step: string, details?: Record<string, unknown>) {
  console.log(`[generate-pdf] ${step}`, details ? JSON.stringify(details) : "");
}

/**
 * Full `puppeteer` bundles a downloaded Chromium build under
 * `~/.cache/puppeteer` — a path outside `node_modules` that Vercel's build
 * output file-tracing cannot see, and even if it could, that desktop-Linux
 * build is missing shared libraries the Lambda-based runtime provides.
 * `@sparticuz/chromium` ships a Chromium built specifically for that
 * environment. Locally we keep using the full `puppeteer` package's own
 * bundled Chromium (nothing extra to install), driven through the same
 * `puppeteer-core` client used in production.
 */
async function launchBrowser(): Promise<Browser> {
  if (IS_VERCEL) {
    const { default: chromium } = await import("@sparticuz/chromium");
    const executablePath = await chromium.executablePath();
    log("launching Chromium (Vercel serverless)", { executablePath });
    return puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: true,
    });
  }

  const { default: localPuppeteer } = await import("puppeteer");
  const executablePath = await localPuppeteer.executablePath();
  log("launching Chromium (local development)", { executablePath });
  return puppeteer.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  if (typeof payload !== "object" || payload === null) {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const { values, reference } = payload as { values?: unknown; reference?: unknown };
  const parseResult = proposalSchema.safeParse(values);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Données invalides.", issues: parseResult.error.flatten() },
      { status: 422 }
    );
  }

  const safeReference =
    typeof reference === "string" && reference.trim() ? reference : "YM-PROPOSITION";

  log("rendering HTML: start");
  const documentData = buildDocumentData(parseResult.data, safeReference);
  const html = renderProposalHtml(documentData);
  log("rendering HTML: done", { htmlLength: html.length });

  let browser: Browser | undefined;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });

    log("page.pdf(): start");
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      // Discreet per-page number in the footer margin. CSS alone can't do
      // this — Chromium's print engine doesn't implement the `@page`
      // counter(page) mechanism, only this Puppeteer-level template. It
      // renders inside the margin box each page's own @page CSS already
      // reserves (0 on the cover via `@page :first`, 15mm elsewhere), so it
      // never touches the cover's full-bleed design.
      displayHeaderFooter: true,
      headerTemplate: "<span></span>",
      footerTemplate:
        '<div style="width:100%;font-size:8px;color:#8a8272;text-align:center;font-family:-apple-system,sans-serif;"><span class="pageNumber"></span></div>',
    });
    log("page.pdf(): done", { bytes: pdfBuffer.length });

    const filename = buildProposalFilename(
      parseResult.data.client.name,
      parseResult.data.client.quoteDate
    );

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    // Full detail goes to the server/Vercel function logs only — the
    // browser always gets the same clean, generic message below.
    console.error("[generate-pdf] PDF generation failed", {
      environment: IS_VERCEL ? "vercel" : "local",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ error: "La génération du PDF a échoué." }, { status: 500 });
  } finally {
    if (browser) {
      log("closing browser");
      await browser.close();
    }
  }
}
