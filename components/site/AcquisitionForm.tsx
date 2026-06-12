"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  role: z.enum(["owner", "broker", "investor"], {
    message: "Please select your role",
  }),
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  location: z.string().min(2, "Please enter the property location or county"),
  acreage: z.string().optional(),
  price: z.string().optional(),
  timeline: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
type State = "idle" | "loading" | "success" | "error";

const inputClass =
  "w-full bg-transparent border-b py-3 text-sm text-white placeholder:text-[color:var(--color-text-subtle)] outline-none transition-colors duration-200 focus:border-[color:var(--color-gold)]";
const inputStyle = { borderColor: "var(--color-border-custom)", caretColor: "var(--color-gold)" };
const labelClass = "block text-[10px] tracking-[0.2em] uppercase mb-3";

const ROLES: { value: FormValues["role"]; label: string }[] = [
  { value: "owner", label: "Landowner" },
  { value: "broker", label: "Broker" },
  { value: "investor", label: "Investor / Partner" },
];

export default function AcquisitionForm() {
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const role = watch("role");

  async function onSubmit(values: FormValues) {
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/acquisitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, source: "acquisitions-page" }),
      });
      if (!res.ok) throw new Error(await res.text());
      setState("success");
      reset();
    } catch (e) {
      setState("error");
      setErrorMsg(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  }

  if (state === "success") {
    return (
      <div className="py-16 px-8 text-center border" style={{ borderColor: "var(--color-border-gold)", background: "var(--color-gold-dim)" }}>
        <div className="text-4xl mb-6" style={{ color: "var(--color-gold)" }}>✓</div>
        <h3 className="font-display text-2xl font-bold text-white mb-3">Submission Received</h3>
        <p className="text-sm max-w-md mx-auto" style={{ color: "var(--color-text-muted)" }}>
          Thank you. We review every submission directly and will be in touch within a few business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-10">
      {/* Role selector */}
      <div>
        <label className={labelClass} style={{ color: "var(--color-gold)" }}>I am a *</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ROLES.map((r) => {
            const active = role === r.value;
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => setValue("role", r.value, { shouldValidate: true })}
                className="px-4 py-3 text-[11px] tracking-[0.15em] uppercase transition-all duration-200 border"
                style={{
                  borderColor: active ? "var(--color-gold)" : "var(--color-border-custom)",
                  background: active ? "var(--color-gold-dim)" : "transparent",
                  color: active ? "var(--color-gold)" : "var(--color-text-muted)",
                }}
              >
                {r.label}
              </button>
            );
          })}
        </div>
        {errors.role && <p className="mt-2 text-[11px]" style={{ color: "#ff6b6b" }}>{errors.role.message}</p>}
      </div>

      {/* Property */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className={labelClass} style={{ color: "var(--color-text-subtle)" }}>Property Location / County *</label>
          <input {...register("location")} placeholder="e.g. Forsyth County, or 123 Main St" className={inputClass} style={inputStyle} />
          {errors.location && <p className="mt-2 text-[11px]" style={{ color: "#ff6b6b" }}>{errors.location.message}</p>}
        </div>
        <div>
          <label className={labelClass} style={{ color: "var(--color-text-subtle)" }}>Approximate Acreage</label>
          <input {...register("acreage")} placeholder="e.g. 25 acres" className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className={labelClass} style={{ color: "var(--color-text-subtle)" }}>Price Expectation (optional)</label>
          <input {...register("price")} placeholder="If you have one in mind" className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className={labelClass} style={{ color: "var(--color-text-subtle)" }}>Timeline (optional)</label>
          <input {...register("timeline")} placeholder="e.g. No rush, or within 6 months" className={inputClass} style={inputStyle} />
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <label className={labelClass} style={{ color: "var(--color-text-subtle)" }}>Full Name *</label>
          <input {...register("name")} placeholder="Your name" className={inputClass} style={inputStyle} autoComplete="name" />
          {errors.name && <p className="mt-2 text-[11px]" style={{ color: "#ff6b6b" }}>{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelClass} style={{ color: "var(--color-text-subtle)" }}>Email *</label>
          <input {...register("email")} type="email" placeholder="you@email.com" className={inputClass} style={inputStyle} autoComplete="email" />
          {errors.email && <p className="mt-2 text-[11px]" style={{ color: "#ff6b6b" }}>{errors.email.message}</p>}
        </div>
        <div>
          <label className={labelClass} style={{ color: "var(--color-text-subtle)" }}>Phone</label>
          <input {...register("phone")} type="tel" placeholder="Optional" className={inputClass} style={inputStyle} autoComplete="tel" />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className={labelClass} style={{ color: "var(--color-text-subtle)" }}>Anything Else</label>
        <textarea {...register("notes")} placeholder="Zoning, current use, or any details about the property" rows={4} className={`${inputClass} resize-none`} style={inputStyle} />
      </div>

      {state === "error" && (
        <p className="text-sm" style={{ color: "#ff6b6b" }}>{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="inline-flex items-center gap-3 px-10 py-4 text-[11px] tracking-[0.3em] uppercase font-medium transition-all duration-300 disabled:opacity-50 hover:gap-5"
        style={{ background: "var(--color-gold)", color: "#000" }}
      >
        {state === "loading" ? "Submitting…" : "Submit Property →"}
      </button>
      <p className="text-[11px]" style={{ color: "var(--color-text-subtle)" }}>
        Confidential and no obligation. We review every submission directly.
      </p>
    </form>
  );
}
