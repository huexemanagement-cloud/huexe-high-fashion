"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useTransition } from "react";
import { submitScoutingApplication } from "@/app/actions/public";
import { useLenis } from "@/components/providers/SmoothScroll";
import { DropZone, type UploadState } from "./DropZone";
import { cn } from "@/lib/utils";

const STEPS = ["Personal Details", "Stats", "Digitals"] as const;

type Digitals = {
  fullLength?: UploadState;
  profile?: UploadState;
  headshot?: UploadState;
  walkVideo?: UploadState;
};

const emptyForm = {
  fullName: "",
  age: "",
  location: "",
  email: "",
  phone: "",
  instagram: "",
  heightCm: "",
  heightFt: "",
  bust: "",
  waist: "",
  hips: "",
  shoe: "",
};

export function ApplyDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ ...emptyForm });
  const [digitals, setDigitals] = useState<Digitals>({});
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const { stop, start } = useLenis();

  useEffect(() => {
    if (open) {
      stop();
      document.body.style.overflow = "hidden";
    } else {
      start();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, stop, start]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = (key: keyof typeof emptyForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const canAdvance =
    step === 0 ? form.fullName.trim().length > 1 && /.+@.+\..+/.test(form.email) : true;

  const submit = () => {
    startTransition(async () => {
      const res = await submitScoutingApplication({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        instagram: form.instagram,
        location: form.location,
        age: form.age,
        measurements: {
          heightCm: form.heightCm,
          heightFt: form.heightFt,
          bust: form.bust,
          waist: form.waist,
          hips: form.hips,
          shoe: form.shoe,
        },
        digitalsUrls: {
          headshot: digitals.headshot?.url,
          profile: digitals.profile?.url,
          fullLength: digitals.fullLength?.url,
          walkVideo: digitals.walkVideo?.url,
        },
      });
      setResult(res);
      if (res.ok) {
        setStep(3);
      }
    });
  };

  const reset = () => {
    setForm({ ...emptyForm });
    setDigitals({});
    setResult(null);
    setStep(0);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[9000]"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
            className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm"
          />
          <motion.aside
            variants={{ hidden: { x: "100%" }, visible: { x: 0 } }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
            className="absolute top-0 right-0 flex h-full w-full flex-col border-l border-raw/10 bg-obsidian md:w-[min(760px,92vw)]"
          >
            <header className="flex items-start justify-between border-b border-raw/10 px-6 py-5 md:px-10">
              <div>
                <p className="mono text-raw/40">Scouting portal — 2026 intake</p>
                <h2 className="display-lg mt-2 text-raw">Submit your digitals</h2>
              </div>
              <button
                onClick={onClose}
                data-cursor="close"
                className="mono border border-raw/20 px-4 py-2 text-raw/70 transition hover:border-raw hover:text-raw"
              >
                Close
              </button>
            </header>

            <nav className="flex gap-6 border-b border-raw/10 px-6 py-4 md:px-10">
              {STEPS.map((label, index) => (
                <button
                  key={label}
                  onClick={() => step < 3 && setStep(index)}
                  className={cn(
                    "mono transition",
                    step === index ? "text-raw" : "text-raw/30 hover:text-raw/60",
                  )}
                >
                  {String(index + 1).padStart(2, "0")} / {label}
                </button>
              ))}
            </nav>

            <div className="no-scrollbar flex-1 overflow-y-auto px-6 py-8 md:px-10">
              <AnimatePresence mode="wait">
                {step === 0 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.35 }}
                    className="grid gap-6 md:grid-cols-2"
                  >
                    <Field label="Full name *" value={form.fullName} onChange={set("fullName")} />
                    <Field label="Age" value={form.age} onChange={set("age")} placeholder="18" />
                    <Field label="Location" value={form.location} onChange={set("location")} placeholder="Chennai, IN" />
                    <Field label="Email *" value={form.email} onChange={set("email")} type="email" />
                    <Field label="Phone / WhatsApp" value={form.phone} onChange={set("phone")} />
                    <Field label="Instagram handle" value={form.instagram} onChange={set("instagram")} placeholder="@" />
                  </motion.div>
                ) : null}

                {step === 1 ? (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.35 }}
                    className="grid gap-6 md:grid-cols-3"
                  >
                    <Field label="Height (cm)" value={form.heightCm} onChange={set("heightCm")} placeholder="178" />
                    <Field label="Height (ft)" value={form.heightFt} onChange={set("heightFt")} placeholder="5'10&quot;" />
                    <Field label="Shoe size" value={form.shoe} onChange={set("shoe")} placeholder="EU 40" />
                    <Field label="Bust / Chest (cm)" value={form.bust} onChange={set("bust")} placeholder="82" />
                    <Field label="Waist (cm)" value={form.waist} onChange={set("waist")} placeholder="61" />
                    <Field label="Hips (cm)" value={form.hips} onChange={set("hips")} placeholder="88" />
                    <p className="mono md:col-span-3 leading-relaxed text-raw/40">
                      Measurements are indicative only. We do not filter by size — we filter by presence.
                    </p>
                  </motion.div>
                ) : null}

                {step === 2 ? (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-6"
                  >
                    <p className="mono leading-relaxed text-raw/45">
                      No makeup. No filters. Natural light. Hair down. Fitted clothing.
                    </p>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <DropZone
                        label="01 / Full-length front"
                        hint="Drag & drop or click — JPG/PNG"
                        accept="image/*"
                        guide="front"
                        value={digitals.fullLength}
                        onChange={(v) => setDigitals((d) => ({ ...d, fullLength: v }))}
                      />
                      <DropZone
                        label="02 / Full-length profile"
                        hint="Side-on, arms relaxed"
                        accept="image/*"
                        guide="profile"
                        value={digitals.profile}
                        onChange={(v) => setDigitals((d) => ({ ...d, profile: v }))}
                      />
                      <DropZone
                        label="03 / Close-up, no makeup"
                        hint="Neutral expression"
                        accept="image/*"
                        guide="closeup"
                        value={digitals.headshot}
                        onChange={(v) => setDigitals((d) => ({ ...d, headshot: v }))}
                      />
                      <DropZone
                        label="04 / 360 walk video"
                        hint="MP4/MOV — max 24MB"
                        accept="video/*"
                        guide="video"
                        value={digitals.walkVideo}
                        onChange={(v) => setDigitals((d) => ({ ...d, walkVideo: v }))}
                      />
                    </div>
                    {result && !result.ok ? (
                      <p className="mono text-accent">{result.message}</p>
                    ) : null}
                  </motion.div>
                ) : null}

                {step === 3 ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex h-full flex-col items-start justify-center gap-6 py-16"
                  >
                    <span className="mono text-raw/40">Application #{new Date().getFullYear()}</span>
                    <h3 className="display-xl text-raw">Received.</h3>
                    <p className="max-w-md text-raw/60">{result?.message}</p>
                    <div className="flex gap-3">
                      <button
                        onClick={reset}
                        data-cursor="again"
                        className="mono border border-raw/25 px-6 py-3 text-raw/70 transition hover:border-raw hover:text-raw"
                      >
                        Submit another
                      </button>
                      <button
                        onClick={onClose}
                        className="mono bg-raw px-6 py-3 text-obsidian transition hover:bg-raw/80"
                      >
                        Back to site
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {step < 3 ? (
              <footer className="flex items-center justify-between gap-4 border-t border-raw/10 px-6 py-5 md:px-10">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="mono text-raw/40 transition enabled:hover:text-raw disabled:opacity-25"
                >
                  ← Back
                </button>
                <div className="mono text-raw/30">
                  Step {step + 1} / 3
                </div>
                {step < 2 ? (
                  <button
                    onClick={() => canAdvance && setStep((s) => s + 1)}
                    disabled={!canAdvance}
                    data-cursor="next"
                    className="mono bg-raw px-8 py-3 text-obsidian transition disabled:opacity-30"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    onClick={submit}
                    disabled={pending}
                    data-cursor="send"
                    className="mono bg-accent px-8 py-3 text-raw transition disabled:opacity-40"
                  >
                    {pending ? "Uploading…" : "Submit digitals"}
                  </button>
                )}
              </footer>
            ) : null}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mono text-raw/40">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border-b border-raw/20 bg-transparent pb-2 text-lg text-raw outline-none transition focus:border-raw placeholder:text-raw/20"
      />
    </label>
  );
}
