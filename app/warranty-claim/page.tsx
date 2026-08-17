"use client";

import { Footer } from "@/components/Footer";
import { LearnMoreLinks } from "@/components/LearnMoreLinks";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { submitForm } from "@/lib/submitForm";
import { Turnstile, TURNSTILE_ENABLED } from "@/components/Turnstile";
import { thankYouUrl } from "@/lib/data/thank-you";
import { RequiredDot } from "@/components/RequiredDot";

// Warranty claim page: light page-head, claim form (emailed to support via Resend)
// with a required proof-of-purchase attachment and optional issue evidence, plus a
// "how claims work" aside. Built from the client-supplied HTML template.

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

// Must stay at or below what /api/contact accepts (MAX_ATTACHMENT_BASE64 there is 4 MB
// of base64, and base64 inflates by ~1/3). Anything larger used to pass this check and
// then be dropped server-side, so support received a claim with no receipt attached.
const MAX_RECEIPT_BYTES = 3 * 1024 * 1024;

// Evidence caps (FA-02). Photos are now genuinely ATTACHED rather than listed by name, so
// they have to fit inside what /api/contact accepts: 6 files and 12 MB of base64 across the
// whole email, receipt included. Held below both so the receipt always has room.
const MAX_EVIDENCE_FILES = 4;
const MAX_EVIDENCE_BYTES = 3 * 1024 * 1024;
const MAX_EVIDENCE_TOTAL_BYTES = 7 * 1024 * 1024;

const models = [
  { value: "GX4K", label: "FineVu GX4K" },
  { value: "GX35", label: "FineVu GX35" },
  { value: "other", label: "Other FineVu model" },
];

const issueTypes = [
  { value: "power", label: "Won’t power on / keeps restarting" },
  { value: "recording", label: "Not recording or footage won’t save" },
  { value: "memory", label: "Memory card errors" },
  { value: "wifi", label: "Wi-Fi / app connection problems" },
  { value: "video", label: "Video or image quality problems" },
  { value: "gps", label: "GPS or speed camera alerts not working" },
  { value: "physical", label: "Physical damage or faulty part" },
  { value: "other", label: "Something else" },
];

const steps = [
  { title: "Submit your claim", body: "Send us your model, serial number and receipt using this form." },
  { title: "We assess it", body: "Our technicians review the issue and confirm your warranty coverage." },
  { title: "Repair or replace", body: "At our option we repair, replace or otherwise remedy your camera. Return shipping is included on approved claims." },
];

const LABEL = "mb-1.5 block text-[13.5px] font-semibold text-[#17181a]";
const INPUT =
  "w-full rounded-[10px] border border-[#d9d9df] bg-white px-3.5 py-3 text-[14.5px] text-[#1d1d1f] placeholder:text-[#8a8a92] outline-none transition-colors focus:border-[var(--finevu-orange)] focus:ring-[3px] focus:ring-[var(--finevu-orange)]/20";
const SELECT_ARROW =
  "appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%2355555C%22%20stroke-width=%222.5%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%3E%3Cpolyline%20points=%226%209%2012%2015%2018%209%22/%3E%3C/svg%3E')] bg-[right_14px_center] bg-no-repeat pr-9";
const ERR = "mt-1.5 text-[12.5px] font-medium text-[#D93025]";
const SECTION_LABEL = "text-[12px] font-bold uppercase tracking-[0.08em] text-[#8a8a92]";

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

function UploadZone({
  accept,
  multiple = false,
  files,
  onSelect,
  invalid,
  describedBy,
  hint,
  ariaLabel,
}: {
  accept: string;
  multiple?: boolean;
  files: File[];
  onSelect: (files: File[]) => void;
  invalid?: boolean;
  /** Ids of the message(s) describing this control — the error, when one is showing. */
  describedBy?: string;
  hint: string;
  ariaLabel: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const active = dragging || files.length > 0;

  const pick = (list: FileList | null) => onSelect(list ? Array.from(list) : []);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      // The red border alone conveyed the failure — colour-only, and invisible to a screen
      // reader. aria-describedby carries the message instead.
      //
      // NOT aria-invalid: this is a role="button" drop target, and aria-invalid is not
      // supported on button (eslint jsx-a11y/role-supports-aria-props flags it). There is
      // no form control here to mark — the real <input type="file"> is hidden — so the
      // description is the whole of what can be announced.
      aria-describedby={describedBy}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
      onDrop={(e) => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files); }}
      className={`cursor-pointer rounded-[10px] border-[1.5px] border-dashed px-5 py-5 text-center transition-colors ${
        invalid
          ? "border-[#D93025]"
          : active
            ? "border-[var(--finevu-orange)] bg-[#fdf1e6]"
            : "border-[#d9d9df] hover:border-[var(--finevu-orange)] hover:bg-[#fdf1e6]"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => pick(e.target.files)}
      />
      <UploadCloud className="mx-auto mb-1.5 h-5 w-5 text-[#8a8a92]" strokeWidth={1.8} />
      <p className="text-[14px] font-semibold text-[#111114]">
        {files.length === 0 ? (
          <><span className="text-[#de6f12]">Choose {multiple ? "files" : "a file"}</span> or drag {multiple ? "them" : "it"} here</>
        ) : files.length === 1 ? (
          <><span className="text-[var(--finevu-orange)]">{files[0].name}</span> — click to change</>
        ) : (
          <><span className="text-[var(--finevu-orange)]">{files.length} files selected</span> — click to change</>
        )}
      </p>
      <p className="mt-1 text-[12.5px] text-[#8a8a92]">{hint}</p>
    </div>
  );
}

function ClaimForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    model: "",
    purchaseDate: "",
    serial: "",
    retailer: "",
    issueType: "",
    description: "",
  });
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptError, setReceiptError] = useState("");
  const [evidence, setEvidence] = useState<File[]>([]);
  const [evidenceError, setEvidenceError] = useState("");
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [error, setError] = useState("");
  const [botcheck, setBotcheck] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaReset, setCaptchaReset] = useState(0);

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setInvalid((prev) => (prev[k] ? { ...prev, [k]: false } : prev));
  };

  const chooseReceipt = (files: File[]) => {
    const f = files[0] ?? null;
    if (f && f.size > MAX_RECEIPT_BYTES) {
      setReceipt(null);
      setReceiptError(
        "That file is over 3 MB. Please choose a smaller file — or email your receipt to support@finevuaustralia.com.au after submitting.",
      );
      return;
    }
    setReceiptError("");
    setReceipt(f);
    if (f) setInvalid((prev) => (prev.receipt ? { ...prev, receipt: false } : prev));
  };

  const chooseEvidence = (files: File[]) => {
    if (files.length > MAX_EVIDENCE_FILES) {
      setEvidenceError(`Please choose up to ${MAX_EVIDENCE_FILES} files. Anything more can be emailed to support@finevuaustralia.com.au after submitting.`);
      return;
    }
    const oversize = files.find((f) => f.size > MAX_EVIDENCE_BYTES);
    if (oversize) {
      setEvidenceError(`"${oversize.name}" is over 3 MB. Please choose a smaller file, or email it to support@finevuaustralia.com.au after submitting.`);
      return;
    }
    if (files.reduce((n, f) => n + f.size, 0) > MAX_EVIDENCE_TOTAL_BYTES) {
      setEvidenceError("Those files are over 7 MB together. Please choose fewer, or email the rest to support@finevuaustralia.com.au after submitting.");
      return;
    }
    setEvidenceError("");
    setEvidence(files);
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const inv: Record<string, boolean> = {};
    if (!form.firstName.trim()) inv.firstName = true;
    if (!form.lastName.trim()) inv.lastName = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) inv.email = true;
    if (!form.phone.trim()) inv.phone = true;
    if (!form.model) inv.model = true;
    if (!form.purchaseDate) inv.purchaseDate = true;
    if (!form.serial.trim()) inv.serial = true;
    if (!form.retailer.trim()) inv.retailer = true;
    if (!receipt) inv.receipt = true;
    if (!form.issueType) inv.issueType = true;
    if (!form.description.trim()) inv.description = true;
    setInvalid(inv);
    if (Object.keys(inv).length > 0 || receiptError || evidenceError) return;
    if (TURNSTILE_ENABLED && !captcha) {
      setError("Please complete the verification below.");
      return;
    }

    setStatus("sending");
    setError("");

    // Read the receipt AND every evidence file (FA-02). Evidence used to be sent as
    // `evidence.map(f => f.name).join(", ")` — a list of filenames and no images, on the
    // one form where that evidence IS the substance of the claim.
    //
    // A read failure now ABORTS instead of quietly setting attachment = undefined and
    // submitting anyway (FA-37). The old path sent `receipt: <filename>` in the fields
    // regardless, so support received a claim asserting a receipt that was not attached
    // and the customer got a success screen. Rare — FileReader only fails on a file that
    // has been moved or made unreadable since it was chosen — but silent, and the receipt
    // is a required field here.
    let attachment: { filename: string; contentBase64: string } | undefined;
    let attachments: { filename: string; contentBase64: string }[] = [];
    try {
      if (receipt) attachment = { filename: receipt.name, contentBase64: await readFileAsBase64(receipt) };
      attachments = await Promise.all(
        evidence.map(async (f) => ({ filename: f.name, contentBase64: await readFileAsBase64(f) })),
      );
    } catch {
      setStatus("idle");
      setError("We couldn’t read one of your files — it may have been moved or renamed. Please re-select it and try again.");
      return;
    }
    const modelLabel = models.find((m) => m.value === form.model)?.label || form.model;
    const issueLabel = issueTypes.find((i) => i.value === form.issueType)?.label || form.issueType;
    const res = await submitForm(
      {
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        model: modelLabel,
        purchase_date: form.purchaseDate,
        serial_number: form.serial,
        retailer: form.retailer,
        issue: issueLabel,
        description: form.description,
        receipt: receipt ? receipt.name : "Not provided",
        // Says ATTACHED because they now are. Anything here that the email does not carry
        // would put us back where FA-02 started.
        evidence: evidence.length ? `${evidence.length} file(s) attached — ${evidence.map((f) => f.name).join(", ")}` : "Not provided",
      },
      { subject: `FineVu warranty claim — ${modelLabel || "product"}`, replyTo: form.email, attachment, attachments, botcheck, turnstileToken: captcha },
    );
    // Stay in "sending" through the navigation so the button can't be re-submitted.
    if (res.ok) router.push(thankYouUrl("warranty-claim"));
    else {
      setStatus("idle");
      setError(res.error);
      // The token is single-use and may already be spent, so reissue one for the retry.
      setCaptcha("");
      setCaptchaReset((n) => n + 1);
    }
  }

  return (
    <motion.form
      {...fadeUp}
      onSubmit={submit}
      noValidate
      className="rounded-[16px] border border-[#e8e8ec] bg-white p-8"
    >
      <h2 className="text-[20px] font-bold tracking-[-0.01em] text-[#111114]">Claim details</h2>
      <p className="mb-6 mt-1.5 text-[14.5px] leading-[1.55] text-[#55555c]">
        Already registered your product? We&apos;ll match your claim to your registration by email and serial number.
      </p>

      <input
        type="text"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={botcheck}
        onChange={(e) => setBotcheck(e.target.value)}
        className="hidden"
      />

      <p className={`${SECTION_LABEL} mb-3.5`}>Your contact details</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="first-name">First name<RequiredDot /></label>
          <input id="first-name" aria-required="true" aria-invalid={invalid.firstName || undefined} aria-describedby={invalid.firstName ? "first-name-err" : undefined} className={INPUT} autoComplete="given-name" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
          {invalid.firstName && <p id="first-name-err" className={ERR}>Enter your first name.</p>}
        </div>
        <div>
          <label className={LABEL} htmlFor="last-name">Last name<RequiredDot /></label>
          <input id="last-name" aria-required="true" aria-invalid={invalid.lastName || undefined} aria-describedby={invalid.lastName ? "last-name-err" : undefined} className={INPUT} autoComplete="family-name" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
          {invalid.lastName && <p id="last-name-err" className={ERR}>Enter your last name.</p>}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="email">Email<RequiredDot /></label>
          <input id="email" aria-required="true" aria-invalid={invalid.email || undefined} aria-describedby={invalid.email ? "email-err" : undefined} type="email" className={INPUT} autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
          {invalid.email && <p id="email-err" className={ERR}>Enter a valid email address.</p>}
        </div>
        <div>
          <label className={LABEL} htmlFor="phone">Phone<RequiredDot /></label>
          <input id="phone" aria-required="true" aria-invalid={invalid.phone || undefined} aria-describedby={invalid.phone ? "phone-err" : undefined} type="tel" className={INPUT} autoComplete="tel" placeholder="04XX XXX XXX" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          {invalid.phone && <p id="phone-err" className={ERR}>Enter a phone number so we can reach you about your claim.</p>}
        </div>
      </div>

      <p className={`${SECTION_LABEL} mb-3.5 mt-7 border-t border-dashed border-[#dddde2] pt-6`}>Your camera</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="model">Dash cam model<RequiredDot /></label>
          <select id="model" aria-required="true" aria-invalid={invalid.model || undefined} aria-describedby={invalid.model ? "model-err" : undefined} className={`${INPUT} ${SELECT_ARROW}`} value={form.model} onChange={(e) => set("model", e.target.value)}>
            <option value="" disabled>Select your model</option>
            {models.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          {invalid.model && <p id="model-err" className={ERR}>Select your model.</p>}
        </div>
        <div>
          <label className={LABEL} htmlFor="purchase-date">Purchase date<RequiredDot /></label>
          <input id="purchase-date" aria-required="true" aria-invalid={invalid.purchaseDate || undefined} aria-describedby={invalid.purchaseDate ? "purchase-date-err" : undefined} type="date" className={INPUT} value={form.purchaseDate} onChange={(e) => set("purchaseDate", e.target.value)} />
          {invalid.purchaseDate && <p id="purchase-date-err" className={ERR}>Enter your purchase date.</p>}
        </div>
      </div>

      <div className="mt-4">
        <label className={LABEL} htmlFor="serial">Serial number<RequiredDot /></label>
        <input id="serial" aria-required="true" aria-invalid={invalid.serial || undefined} aria-describedby={invalid.serial ? "serial-hint serial-err" : "serial-hint"} className={INPUT} placeholder="e.g. FV4K-XXXXXXXX" value={form.serial} onChange={(e) => set("serial", e.target.value)} />
        <p id="serial-hint" className="mt-1.5 text-[12.5px] leading-[1.5] text-[#8a8a92]">Printed on the sticker on the back of your camera, and on the side of the box.</p>
        {invalid.serial && <p id="serial-err" className={ERR}>Enter your serial number.</p>}
      </div>

      <div className="mt-4">
        <label className={LABEL} htmlFor="retailer">Where did you buy it?<RequiredDot /></label>
        <input id="retailer" aria-required="true" aria-invalid={invalid.retailer || undefined} aria-describedby={invalid.retailer ? "retailer-err" : undefined} className={INPUT} placeholder="Retailer or store name" value={form.retailer} onChange={(e) => set("retailer", e.target.value)} />
        {invalid.retailer && <p id="retailer-err" className={ERR}>Enter the retailer name.</p>}
      </div>

      <div className="mt-4">
        <label className={LABEL}>Proof of purchase<RequiredDot /></label>
        <UploadZone
          accept=".jpg,.jpeg,.png,.pdf,.heic"
          files={receipt ? [receipt] : []}
          onSelect={chooseReceipt}
          invalid={invalid.receipt}
          // Both messages render under the same id — only one is ever shown at a time.
          describedBy={receiptError || invalid.receipt ? "receipt-err" : undefined}
          hint="Receipt or order confirmation — JPG, PNG, HEIC or PDF, up to 3 MB"
          ariaLabel="Upload your receipt (required)"
        />
        {receiptError && <p id="receipt-err" className={ERR}>{receiptError}</p>}
        {invalid.receipt && !receiptError && <p id="receipt-err" className={ERR}>Upload your receipt — we need it to verify your warranty.</p>}
      </div>

      <p className={`${SECTION_LABEL} mb-3.5 mt-7 border-t border-dashed border-[#dddde2] pt-6`}>The problem</p>

      <div>
        <label className={LABEL} htmlFor="issue-type">What&apos;s the issue?<RequiredDot /></label>
        <select id="issue-type" aria-required="true" aria-invalid={invalid.issueType || undefined} aria-describedby={invalid.issueType ? "issue-type-err" : undefined} className={`${INPUT} ${SELECT_ARROW}`} value={form.issueType} onChange={(e) => set("issueType", e.target.value)}>
          <option value="" disabled>Select the closest match</option>
          {issueTypes.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
        </select>
        {invalid.issueType && <p id="issue-type-err" className={ERR}>Select the type of issue.</p>}
      </div>

      <div className="mt-4">
        <label className={LABEL} htmlFor="description">Describe what&apos;s happening<RequiredDot /></label>
        <textarea
          id="description" aria-required="true" aria-invalid={invalid.description || undefined} aria-describedby={invalid.description ? "description-err" : undefined}
          rows={5}
          className={`${INPUT} resize-y leading-[1.55]`}
          placeholder="What happens, when it started, and anything you've already tried — the more detail, the faster we can help."
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
        {invalid.description && <p id="description-err" className={ERR}>Describe the issue so our technicians can assess it.</p>}
      </div>

      <div className="mt-4">
        <label className={LABEL}>Photos or video of the issue <span className="font-normal text-[#8a8a92]">(optional)</span></label>
        {/* accept no longer offers .mp4/.mov (FA-02). The server's ALLOWED_ATTACHMENT_EXTS
            has never included video, so a clip would now be REFUSED rather than quietly
            reduced to a filename — offering it would be inviting a rejected submission.
            The hint says where video should go instead. */}
        <UploadZone
          accept=".jpg,.jpeg,.png,.webp,.heic,.pdf"
          multiple
          files={evidence}
          onSelect={chooseEvidence}
          invalid={Boolean(evidenceError)}
          describedBy={evidenceError ? "evidence-err" : undefined}
          hint="Photos or screenshots — up to 4 files, 3 MB each. Video? Email it to support after submitting"
          ariaLabel="Upload photos of the issue"
        />
        {evidenceError && <p id="evidence-err" className={ERR}>{evidenceError}</p>}
      </div>

      <div className="mt-6">
        <Turnstile onToken={setCaptcha} resetKey={captchaReset} />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="cta-hover mt-6 w-full rounded-full bg-[var(--finevu-orange)] px-8 py-[15px] text-[13px] font-bold uppercase leading-[20px] tracking-[0.06em] text-white disabled:opacity-70 sm:w-auto"
      >
        {status === "sending" ? "Submitting…" : "Submit claim"}
      </button>
      {error && <p className={`${ERR} mt-3.5`}>{error}</p>}
    </motion.form>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Page head */}
      <section data-nav-theme="light">
        <div className="mx-auto max-w-[760px] px-6 pt-36 pb-10 text-center md:pt-44 md:pb-14">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-[34px] font-bold leading-[1.1] tracking-[-0.02em] text-[#111114] md:text-[46px]"
          >
            Start a warranty claim
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mx-auto mt-3.5 max-w-[620px] text-[16.5px] leading-[1.6] text-[#55555c]"
          >
            Every FineVu dash cam is covered by a{" "}
            <Link href="/warranty" className="font-semibold text-[var(--finevu-orange)]">
              voluntary warranty against defects
            </Link>
            , no matter which authorised retailer you purchased from. Tell us what&apos;s wrong and we&apos;ll take it
            from there.
          </motion.p>
        </div>
      </section>

      {/* Form + aside */}
      <section className="pb-20 pt-4 md:pb-[96px] md:pt-6" data-nav-theme="light">
        <div className="mx-auto grid max-w-[1040px] items-start gap-6 px-6 lg:grid-cols-[1.5fr_1fr]">
          <ClaimForm />

          <motion.aside {...fadeUp} className="rounded-[16px] border border-[#e8e8ec] bg-white p-8">
            <h2 className="text-[20px] font-bold tracking-[-0.01em] text-[#111114]">How claims work</h2>
            <p className="mb-2 mt-1.5 text-[14.5px] leading-[1.55] text-[#55555c]">Three steps from claim to fix.</p>
            {steps.map((s, i) => (
              <div key={s.title} className="flex items-start gap-3.5 border-b border-dashed border-[#dddde2] py-3.5 last:border-b-0">
                <span className="mt-0.5 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[#fdf1e6] text-[13px] font-bold text-[#de6f12]">
                  {i + 1}
                </span>
                <div>
                  <h3 className="mb-0.5 text-[14.5px] font-bold text-[#111114]">{s.title}</h3>
                  <p className="text-[13.5px] leading-[1.55] text-[#55555c]">{s.body}</p>
                </div>
              </div>
            ))}
            <div className="mt-6 rounded-[12px] bg-[#f7f7f9] px-5 py-[18px]">
              <h3 className="mb-1.5 text-[14px] font-bold text-[#111114]">Before you claim</h3>
              <p className="text-[13.5px] leading-[1.6] text-[#55555c]">
                Many common issues — memory card errors, Wi-Fi drop-outs, footage not saving — can be fixed in a few
                minutes. Check our{" "}
                <Link href="/support" className="font-semibold text-[var(--finevu-orange)]">troubleshooting guide</Link>{" "}
                first; it might save you the wait. For what&apos;s covered and for how long, see the{" "}
                <Link href="/warranty" className="font-semibold text-[var(--finevu-orange)]">warranty terms</Link>.
              </p>
            </div>
          </motion.aside>
        </div>
      </section>

      <LearnMoreLinks />
      <Footer />
    </div>
  );
}
