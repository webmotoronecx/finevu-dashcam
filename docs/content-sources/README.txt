========================================================================
CONTENT SOURCES OF TRUTH
========================================================================

WHAT THIS IS
------------
Plain-text distillations of the official FineVu product data. These are the
canonical facts the content-accuracy audit compares the website against.

  general.txt - FineVu General Information
  gx4k.txt   — FineVu GX4K (official spec sheet + box contents + reviews)
  gx35.txt   — FineVu GX35 (same)

The raw HTML scrapes and box-contents PNGs live OUTSIDE the app at
finevu/data/ . They are the provenance; these .txt files are the working
truth. If FineVu changes something, update the .txt file — not the scrape.

WARRANTY & TERMS COPY — DO NOT DUPLICATE HERE
---------------------------------------------
There is deliberately NO warranty.txt or terms.txt in this folder. The warranty
and installation-terms copy already lives as structured data that renders those
pages, and THOSE files are the canonical source for that copy:

  lib/data/warranty.ts            — the canonical warranty statement
                                    (periods, ACL wording, what's covered)
  lib/data/installation-terms.ts  — the canonical installation Terms
                                    (§ payment, cancellation, agreement, etc.)

Copying them into a .txt here would just create two drifting copies of the same
thing, so we don't. When the audit checks warranty/terms claims anywhere else on
the site (homepage tile, product tiles, About, disclaimer 3 in site.config.ts,
support page), it treats these two lib/data files as the anchor and flags any page
that disagrees with them. Update warranty/terms copy in lib/data — not here.

NOTE — anchor vs. authority: these two files verify CONSISTENCY (does the rest of
the site match them?), not CORRECTNESS (are the terms themselves what AutoXtreme
legally committed to?). The legal source of truth is an external AutoXtreme
document. If/when you have it, add a short content-sources/legal-commitments.txt
holding only the committed FIGURES (warranty periods, returns window, cancellation
%, ACL clause ref) as a checklist — not a copy of the prose.

THE AUDIT FLOW
--------------
  1. Update the source(s) of truth:  edit docs/content-sources/gx4k.txt and/or gx35.txt
  2. Run:  /content-audit
  3. The command re-audits the MVP pages against these files, rewrites the
     narrative (docs/content-accuracy-audit-*.md) and appends a dated row set
     to the change log (docs/content-accuracy-changes.csv).

WHO OWNS THESE FILES
--------------------
YOU do. These files are user-owned. Claude / the /content-audit command READS them as
the authority but must NEVER edit them on its own — not the facts, not the structure,
not the annotations. It can propose an edit in chat, but only you change the source.

The "{!needs approval}" tag: append it to any line that is provisional / unconfirmed.
While it is present, the audit holds every site claim that depends on that line at
"Needs approval" — no matter how strong the evidence Claude is shown. ONLY YOU
remove the tag, explicitly. That is what makes a line "approved".

The change log (docs/content-accuracy-changes.csv) uses exactly THREE Status values:
  Applied         — decided by us and in the code
  Pending         — ours to decide, agreed, just not applied yet
  Needs approval  — beyond our call: ops/legal/business, or a fact we don't have
                    (this is where {!needs approval} lines land)

HOW TO EDIT
-----------
- Keep the "== SECTION ==" headers exactly as they are; /content-audit relies
  on them. Change values, not the structure.
- SPECS: one fact per line, "Field: value". Note wording that matters (e.g.
  GX4K "Built-In" vs GX35 "O" for GPS — that distinction drives a finding).
- IN THE BOX / ADDITIONAL OPTIONS: these come from ARTWORK, not page text, so
  they can only be updated by hand. If you re-open a real AU retail box and it
  differs, edit the list and note it under AU OVERRIDES.
- AU OVERRIDES: when the Australian bundle legitimately differs from Korea
  (e.g. the GX35's 64GB card), record it here. The AU value wins for the site.
- NOT IN SOURCE: claims the site makes that have no basis in official data.
  Move a line out of here only once FineVu confirms it.

PROVENANCE
----------
Scraped 2026-07-24 from https://en.finevu.com . Box artwork:
  gx4k_tab_whatsInTheBox_1.png / _2.png
  GX35_basic_configuration.png / GX35_additional_options.png
The -specs scrape variants are identical to the base scrapes (nav-only diff).
