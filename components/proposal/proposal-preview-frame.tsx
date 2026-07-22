"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

const PAGE_WIDTH_PX = 793.7; // 210mm at 96dpi

export function ProposalPreviewFrame({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const updateScale = () => {
      setScale(Math.min(1, container.clientWidth / PAGE_WIDTH_PX));
    };
    const updateHeight = () => {
      setContentHeight(content.scrollHeight);
    };

    updateScale();
    updateHeight();

    const containerObserver = new ResizeObserver(updateScale);
    const contentObserver = new ResizeObserver(updateHeight);
    containerObserver.observe(container);
    contentObserver.observe(content);

    return () => {
      containerObserver.disconnect();
      contentObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full min-w-0 overflow-hidden">
      <div style={{ height: contentHeight * scale || undefined }}>
        <div
          ref={contentRef}
          style={{
            width: PAGE_WIDTH_PX,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
