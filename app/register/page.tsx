"use client";

import { Footer } from "@/components/Footer";
import { LearnMoreLinks } from "@/components/LearnMoreLinks";
import { motion } from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Check, UploadCloud } from "lucide-react";
import { submitForm } from "@/lib/submitForm";

// Product registration page: dark hero, registration form (emailed to support via
// Resend) with optional receipt attachment, and a "why register" aside.

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const MAX_RECEIPT_BYTES = 10 * 1024 * 1024;

const models = [
  { value: "GX4K", label: "FineVu GX4K" },
  { value: "GX35", label: "FineVu GX35" },
  { value: "other", label: "Other FineVu model" },
];

const benefits = [
  "Faster warranty claims with pre-verified details",
  "Firmware update notifications for your model",
  "Keep your proof of purchase safely on record",
];

const LABEL = "mb-1.5 block text-[13.5px] font-semibold text-[#17181a]";
const INPUT =
  "w-full rounded-[10px] border border-[#d9d9df] bg-white px-3.5 py-3 text-[14.5px] text-[#1d1d1f] placeholder:text-[#8a8a92] outline-none transition-colors focus:border-[var(--finevu-orange)] focus:ring-[3px] focus:ring-[var(--finevu-orange)]/20";
const ERR = "mt-1.5 text-[12.5px] font-medium text-[#D93025]";

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

function RegisterForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    model: "",
    purchaseDate: "",
    serial: "",
    retailer: "",
  });
  const [notify, setNotify] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const [botcheck, setBotcheck] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setInvalid((prev) => (prev[k] ? { ...prev, [k]: false } : prev));
  };

  const chooseFile = (f: File | null) => {
    if (!f) {
      setFile(null);
      setFileError("");
      return;
    }
    if (f.size > MAX_RECEIPT_BYTES) {
      setFile(null);
      setFileError(
        "That file is over 10 MB. Please choose a smaller file — or email your receipt to support@finevuaustralia.com.au after registering.",
      );
      return;
    }
    setFileError("");
    setFile(f);
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (botcheck) {
      setStatus("done");
      return;
    }
    const inv: Record<string, boolean> = {};
    if (!form.firstName.trim()) inv.firstName = true;
    if (!form.lastName.trim()) inv.lastName = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) inv.email = true;
    if (!form.model) inv.model = true;
    if (!form.purchaseDate) inv.purchaseDate = true;
    if (!form.serial.trim()) inv.serial = true;
    if (!form.retailer.trim()) inv.retailer = true;
    setInvalid(inv);
    if (Object.keys(inv).length > 0 || fileError) return;

    setStatus("sending");
    setError("");
    let attachment: { filename: string; contentBase64: string } | undefined;
    if (file) {
      try {
        attachment = { filename: file.name, contentBase64: await readFileAsBase64(file) };
      } catch {
        attachment = undefined;
      }
    }
    const res = await submitForm(
      {
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        model: form.model,
        purchase_date: form.purchaseDate,
        serial_number: form.serial,
        retailer: form.retailer,
        firmware_updates: notify ? "Yes" : "No",
        receipt: file ? file.name : "Not provided",
      },
      { subject: `FineVu product registration — ${form.model || "product"}`, replyTo: form.email, attachment },
    );
    if (res.ok) setStatus("done");
    else {
      setStatus("idle");
      setError(res.error);
    }
  }

  if (status === "done") {
    return (
      <motion.div {...fadeUp} className="rounded-[16px] border border-[#e8e8ec] bg-white p-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#fdf1e6]">
          <Check className="h-6 w-6 text-[var(--finevu-orange)]" strokeWidth={2.5} />
        </div>
        <h3 className="mb-2 text-[20px] font-bold text-[#111114]">You&apos;re registered</h3>
        <p className="mx-auto max-w-[380px] text-[14.5px] leading-[1.6] text-[#55555c]">
          We&apos;ve saved your details. If you ever need to make a warranty claim, we&apos;ll already have
          everything on file.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      {...fadeUp}
      onSubmit={submit}
      noValidate
      className="rounded-[16px] border border-[#e8e8ec] bg-white p-8 md:p-8"
    >
      <h2 className="text-[20px] font-bold tracking-[-0.01em] text-[#111114]">Your details</h2>
      <p className="mb-6 mt-1.5 text-[14.5px] leading-[1.55] text-[#55555c]">
        All we need is your contact info and the camera you purchased. Fields marked optional can be skipped.
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="first-name">First name</label>
          <input id="first-name" className={INPUT} autoComplete="given-name" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
          {invalid.firstName && <p className={ERR}>Enter your first name.</p>}
        </div>
        <div>
          <label className={LABEL} htmlFor="last-name">Last name</label>
          <input id="last-name" className={INPUT} autoComplete="family-name" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
          {invalid.lastName && <p className={ERR}>Enter your last name.</p>}
        </div>
      </div>

      <div className="mt-4">
        <label className={LABEL} htmlFor="email">Email</label>
        <input id="email" type="email" className={INPUT} autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
        {invalid.email && <p className={ERR}>Enter a valid email address.</p>}
      </div>

      <div className="mt-4">
        <label className={LABEL} htmlFor="phone">Phone <span className="font-normal text-[#8a8a92]">(optional)</span></label>
        <input id="phone" type="tel" className={INPUT} autoComplete="tel" placeholder="04XX XXX XXX" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="model">Dash cam model</label>
          <select id="model" className={`${INPUT} appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%2355555C%22%20stroke-width=%222.5%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%3E%3Cpolyline%20points=%226%209%2012%2015%2018%209%22/%3E%3C/svg%3E')] bg-[right_14px_center] bg-no-repeat pr-9`} value={form.model} onChange={(e) => set("model", e.target.value)}>
            <option value="" disabled>Select your model</option>
            {models.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          {invalid.model && <p className={ERR}>Select your model.</p>}
        </div>
        <div>
          <label className={LABEL} htmlFor="purchase-date">Purchase date</label>
          <input id="purchase-date" type="date" className={INPUT} value={form.purchaseDate} onChange={(e) => set("purchaseDate", e.target.value)} />
          {invalid.purchaseDate && <p className={ERR}>Enter your purchase date.</p>}
        </div>
      </div>

      <div className="mt-4">
        <label className={LABEL} htmlFor="serial">Serial number</label>
        <input id="serial" className={INPUT} placeholder="e.g. FV4K-XXXXXXXX" value={form.serial} onChange={(e) => set("serial", e.target.value)} />
        <p className="mt-1.5 text-[12.5px] leading-[1.5] text-[#8a8a92]">Printed on the sticker on the back of your camera, and on the side of the box.</p>
        {invalid.serial && <p className={ERR}>Enter your serial number.</p>}
      </div>

      <div className="mt-4">
        <label className={LABEL} htmlFor="retailer">Where did you buy it?</label>
        <input id="retailer" className={INPUT} placeholder="Retailer or store name" value={form.retailer} onChange={(e) => set("retailer", e.target.value)} />
        {invalid.retailer && <p className={ERR}>Enter the retailer name.</p>}
      </div>

      <div className="mt-4">
        <label className={LABEL}>Proof of purchase <span className="font-normal text-[#8a8a92]">(optional, but speeds up claims)</span></label>
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
          onDrop={(e) => { e.preventDefault(); setDragging(false); chooseFile(e.dataTransfer.files?.[0] ?? null); }}
          className={`cursor-pointer rounded-[10px] border-[1.5px] border-dashed px-5 py-5 text-center transition-colors ${
            dragging || file ? "border-[var(--finevu-orange)] bg-[#fdf1e6]" : "border-[#d9d9df] hover:border-[var(--finevu-orange)] hover:bg-[#fdf1e6]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf,.heic"
            className="hidden"
            onChange={(e) => chooseFile(e.target.files?.[0] ?? null)}
          />
          <UploadCloud className="mx-auto mb-1.5 h-5 w-5 text-[#8a8a92]" strokeWidth={1.8} />
          <p className="text-[14px] font-semibold text-[#111114]">
            {file ? (
              <><span className="text-[var(--finevu-orange)]">{file.name}</span> — click to change</>
            ) : (
              <><span className="text-[#de6f12]">Choose a file</span> or drag it here</>
            )}
          </p>
          <p className="mt-1 text-[12.5px] text-[#8a8a92]">JPG, PNG, HEIC or PDF — up to 10 MB</p>
        </div>
        {fileError && <p className={ERR}>{fileError}</p>}
      </div>

      <div className="my-6 flex items-start gap-2.5">
        <input id="notify" type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[var(--finevu-orange)]" />
        <label htmlFor="notify" className="text-[13.5px] leading-[1.55] text-[#55555c]">
          Email me firmware update notifications for my model. No marketing — just updates that keep your camera running its best.
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="cta-hover w-full rounded-full bg-[var(--finevu-orange)] px-8 py-[15px] text-[13px] font-bold uppercase leading-[20px] tracking-[0.06em] text-white disabled:opacity-70 sm:w-auto"
      >
        {status === "sending" ? "Registering…" : "Register now"}
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
            Register your product
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mx-auto mt-3.5 max-w-[620px] text-[16.5px] leading-[1.6] text-[#55555c]"
          >
            Registering takes two minutes and makes any future warranty claim faster — we&apos;ll already have
            your details on file.
          </motion.p>
        </div>
      </section>

      {/* Form + aside */}
      <section className="pb-20 pt-4 md:pb-[96px] md:pt-6" data-nav-theme="light">
        <div className="mx-auto grid max-w-[1040px] items-start gap-6 px-6 lg:grid-cols-[1.5fr_1fr]">
          <RegisterForm />

          <motion.aside {...fadeUp} className="rounded-[16px] border border-[#e8e8ec] bg-white p-8">
            <h2 className="text-[20px] font-bold tracking-[-0.01em] text-[#111114]">Why register?</h2>
            <p className="mb-2 mt-1.5 text-[14.5px] leading-[1.55] text-[#55555c]">Two minutes now saves you time later.</p>
            {benefits.map((b) => (
              <div key={b} className="flex items-start gap-3 border-b border-dashed border-[#dddde2] py-3.5 last:border-b-0">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--finevu-orange)]" />
                <p className="text-[14.5px] leading-[1.55] text-[#111114]">{b}</p>
              </div>
            ))}
            <div className="mt-6 rounded-[12px] bg-[#f7f7f9] px-5 py-[18px]">
              <h3 className="mb-1.5 text-[14px] font-bold text-[#111114]">Can&apos;t find your serial number?</h3>
              <p className="text-[13.5px] leading-[1.6] text-[#55555c]">
                It&apos;s on the sticker on the back of the camera body, and printed on the side of the retail box.
                In the FineVu Wi-Fi app, you can also find it under Settings → Device information.
              </p>
            </div>
            <p className="mt-6 text-[13px] leading-[1.55] text-[#8a8a92]">
              Prefer to talk to someone? <Link href="/support" className="font-semibold text-[var(--finevu-orange)]">Contact support</Link>.
            </p>
          </motion.aside>
        </div>
      </section>

      <LearnMoreLinks />
      <Footer />
    </div>
  );
}
