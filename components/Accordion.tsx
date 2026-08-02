"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

// Shared question/answer accordion — line-separated rows, rotating orange chevron and a
// height-agnostic grid-rows 0fr→1fr slide. Used for the FAQs on /faq, /installation and
// /become-a-retailer, and the troubleshooting list on /support, each of which hand-rolled
// its own copy of this before.
//
// Unrelated to components/ui/accordion.tsx (the vendored Radix primitive, currently unused).

export interface AccordionItemProps {
    q: string;
    /** A single paragraph, or several rendered as separate <p>s. */
    a: string | string[];
}

export function AccordionItem({ q, a }: AccordionItemProps) {
    const [open, setOpen] = useState(false);
    const paragraphs = Array.isArray(a) ? a : [a];

    return (
        <div className="border-b border-[#e7e7ea]">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                className={`flex w-full items-center justify-between gap-5 py-[22px] text-left text-[17px] font-semibold leading-snug tracking-[-0.005em] transition-colors md:text-[18px] ${
                    open ? "text-[var(--finevu-orange)]" : "text-[#17181a]"
                }`}
            >
                {q}
                <ChevronDown
                    className={`h-[18px] w-[18px] shrink-0 transition-transform duration-300 motion-reduce:transition-none ${
                        open ? "rotate-180 text-[var(--finevu-orange)]" : "text-[#9c9ca3]"
                    }`}
                />
            </button>
            {/* Collapsible body (grid-rows 0fr→1fr for a height-agnostic slide) */}
            <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
            >
                <div className="overflow-hidden">
                    <div className="max-w-[700px] space-y-3 pb-6 text-[16px] leading-[1.6] text-[#6b6b72]">
                        {paragraphs.map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/** The full list, including the top rule that closes the first row's border. */
export function Accordion({ items, className = "" }: { items: AccordionItemProps[]; className?: string }) {
    return (
        <div className={`border-t border-[#e7e7ea] ${className}`.trim()}>
            {items.map((item) => (
                <AccordionItem key={item.q} q={item.q} a={item.a} />
            ))}
        </div>
    );
}
