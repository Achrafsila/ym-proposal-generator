/**
 * A4 content-area height in CSS pixels at 96dpi: 297mm page minus the
 * 2×15mm vertical @page margin now applied in proposal-document.css
 * (previously 297mm, when margins were plain element padding instead).
 */
export const A4_PAGE_HEIGHT_PX = 267 * (96 / 25.4);

/**
 * Counts how many `.proposal-page` elements under `root` are taller than a
 * single A4 page — i.e. how many pages the generated PDF would actually
 * spill onto beyond the element's own page-break. Used to warn before
 * generation without ever truncating content silently.
 */
export function countOverflowingPages(root: HTMLElement): number {
  const pages = root.querySelectorAll<HTMLElement>(".proposal-page");
  let overflowing = 0;
  pages.forEach((page) => {
    if (page.scrollHeight > A4_PAGE_HEIGHT_PX + 1) {
      overflowing += 1;
    }
  });
  return overflowing;
}
