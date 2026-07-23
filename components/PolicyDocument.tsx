"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Footer } from "@/components/Footer";

export type PolicyBlock =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "heading"; text: string; id: string }
  | { type: "address"; lines: string[] }
  | { type: "table"; columns: [string, string]; rows: [string, string][] };

export type PolicySubsection = { title: string; id: string };

export type PolicySection = {
  n: number;
  title: string;
  subsections?: PolicySubsection[];
  blocks: PolicyBlock[];
};

export type PolicyDocumentProps = {
  title: string;
  meta: string;
  sections: PolicySection[];
};

function Block({ block }: { block: PolicyBlock }) {
  if (block.type === "p") {
    return <p className="text-[15px] leading-[1.75] text-[#3a3a40]">{block.text}</p>;
  }
  if (block.type === "heading") {
    return (
      <h3 id={block.id} className="scroll-mt-32 pt-3 text-[16px] font-semibold text-[#1d1d1f]">
        {block.text}
      </h3>
    );
  }
  if (block.type === "list") {
    return (
      <ul className="list-disc space-y-2 pl-5 text-[15px] leading-[1.7] text-[#3a3a40] marker:text-[#c9c9cf]">
        {block.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }
  if (block.type === "address") {
    return (
      <div className="text-[15px] leading-[1.7] text-[#3a3a40]">
        {block.lines.map((line, i) => (
          <div key={i} className={i === 0 ? "font-semibold text-[#1d1d1f]" : undefined}>
            {line}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse overflow-hidden rounded-xl border border-[#e8e7e2] text-left text-[14px]">
        <thead>
          <tr className="bg-[#f7f6f3] text-[#1d1d1f]">
            <th className="px-4 py-3 font-semibold">{block.columns[0]}</th>
            <th className="px-4 py-3 font-semibold">{block.columns[1]}</th>
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, i) => (
            <tr key={i} className="border-t border-[#e8e7e2] text-[#3a3a40]">
              <td className="px-4 py-3">{row[0]}</td>
              <td className="px-4 py-3">{row[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PolicyDocument({ title, meta, sections }: PolicyDocumentProps) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState<Set<number>>(
    () => new Set(sections.map((s, i) => (s.subsections?.length ? i : -1)).filter((i) => i >= 0)),
  );
  const contentRef = useRef<HTMLDivElement>(null);
  const pendingSub = useRef<string | null>(null);
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const sub = pendingSub.current;
    pendingSub.current = null;
    const timer = window.setTimeout(() => {
      const target = sub ? document.getElementById(sub) : contentRef.current;
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [active]);

  const select = (index: number, subId?: string) => {
    if (index === active) {
      const target = subId ? document.getElementById(subId) : contentRef.current;
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    pendingSub.current = subId ?? null;
    setActive(index);
  };

  const toggle = (index: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const current = sections[active];

  return (
    <div className="min-h-screen bg-white" data-nav-theme="light">
      <header className="mx-auto max-w-[1180px] px-6 pb-10 pt-36 text-center md:pt-44 lg:px-10">
        <h1 className="text-4xl font-bold tracking-tight text-[#1d1d1f] md:text-5xl">{title}</h1>
        <p className="mt-4 text-sm text-[#9a9da5]">{meta}</p>
      </header>

      <div className="mx-auto grid max-w-[1180px] gap-10 px-6 pb-24 lg:grid-cols-[300px_1fr] lg:gap-16 lg:px-10">
        <nav className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto">
          <ol className="rounded-2xl border border-[#e8e7e2] p-3">
            {sections.map((section, i) => {
              const hasSubs = !!section.subsections?.length;
              const isActive = i === active;
              const isOpen = expanded.has(i);
              return (
                <li key={section.n}>
                  <div
                    className={`flex items-start rounded-lg transition-colors ${
                      isActive ? "bg-[#fff1e8]" : "hover:bg-[#f7f6f3]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => select(i)}
                      className="flex flex-1 items-start gap-3 px-3 py-2 text-left text-[14px] leading-snug"
                    >
                      <span
                        className={`shrink-0 tabular-nums ${
                          isActive ? "text-[var(--finevu-orange)]" : "text-[#9a9da5]"
                        }`}
                      >
                        {section.n}
                      </span>
                      <span className={isActive ? "font-medium text-[#1d1d1f]" : "text-[#3a3a40]"}>
                        {section.title}
                      </span>
                    </button>
                    {hasSubs && (
                      <button
                        type="button"
                        aria-label={isOpen ? "Collapse section" : "Expand section"}
                        onClick={() => toggle(i)}
                        className="px-2 py-2.5 text-[#9a9da5]"
                      >
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    )}
                  </div>
                  {hasSubs && isOpen && (
                    <ul className="mb-1 ml-[26px] space-y-1 border-l border-[#e8e7e2] pl-3">
                      {section.subsections!.map((sub) => (
                        <li key={sub.id}>
                          <button
                            type="button"
                            onClick={() => select(i, sub.id)}
                            className="py-1 text-left text-[13px] leading-snug text-[#6b6b73] transition-colors hover:text-[var(--finevu-orange)]"
                          >
                            {sub.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <article ref={contentRef} className="scroll-mt-28">
          <h2 className="mb-6 text-[21px] font-semibold text-[#1d1d1f]">
            <span className="mr-2 text-[#9a9da5]">{current.n}</span>
            {current.title}
          </h2>
          <div className="space-y-5">
            {current.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
        </article>
      </div>

      <Footer />
    </div>
  );
}
