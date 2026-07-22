import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import puppeteer from "puppeteer";

import { buildDocumentData } from "@/lib/build-document-data";
import { buildProposalFilename } from "@/lib/filename";
import { proposalSchema } from "@/lib/proposal-schema";
import { renderProposalHtml } from "@/lib/render-proposal-html";

export const runtime = "nodejs";

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
  const documentData = buildDocumentData(parseResult.data, safeReference);
  const html = renderProposalHtml(documentData);

  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | undefined;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });

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
    console.error("PDF generation failed", error);
    return NextResponse.json({ error: "La génération du PDF a échoué." }, { status: 500 });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
