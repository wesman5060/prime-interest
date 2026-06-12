"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, "Please enter a message (at least 10 characters)"),
});

type FormValues = z.infer<typeof schema>;

type State = "idle" | "loading" | "success" | "error";

const inputClass =
  "w-full bg-transparent border-b py-3 text-sm text-white placeholder:text-[color:var(--color-text-subtle)] outline-none transition-colors duration-200 focus:border-[color:var(--color-gold)]";
const inputStyle = { borderColor: "var(--color-border-custom)", caretColor: "var(--color-gold)" };

export default function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
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
      <div className="py-16 text-center border" style={{ borderColor: "var(--color-border-gold)", background: "var(--color-gold-dim)" }}>
        <div className="text-4xl mb-6" style={{ color: "var(--color-gold)" }}>✓</div>
        <h3 className="font-display text-2xl font-bold text-white mb-3">Message Received</h3>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Thank you. Marty will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      <p className="text-xs tracking-[0.3em] uppercase mb-8" style={{ color: "var(--color-gold)" }}>
        Send a Message
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <input
            {...register("name")}
            placeholder="Full Name *"
            className={inputClass}
            style={inputStyle}
            autoComplete="name"
          />
          {errors.name && (
            <p className="mt-2 text-[11px]" style={{ color: "#ff6b6b" }}>{errors.name.message}</p>
          )}
        </div>
        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="Email Address *"
            className={inputClass}
            style={inputStyle}
            autoComplete="email"
          />
          {errors.email && (
            <p className="mt-2 text-[11px]" style={{ color: "#ff6b6b" }}>{errors.email.message}</p>
          )}
        </div>
        <div>
          <input
            {...register("phone")}
            type="tel"
            placeholder="Phone Number"
            className={inputClass}
            style={inputStyle}
            autoComplete="tel"
          />
        </div>
        <div>
          <input
            {...register("company")}
            placeholder="Company / Organization"
            className={inputClass}
            style={inputStyle}
            autoComplete="organization"
          />
        </div>
      </div>

      <div>
        <textarea
          {...register("message")}
          placeholder="Your message — site details, acreage, location, or general inquiry *"
          rows={5}
          className={`${inputClass} resize-none`}
          style={inputStyle}
        />
        {errors.message && (
          <p className="mt-2 text-[11px]" style={{ color: "#ff6b6b" }}>{errors.message.message}</p>
        )}
      </div>

      {state === "error" && (
        <p className="text-sm" style={{ color: "#ff6b6b" }}>{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="inline-flex items-center gap-3 px-10 py-4 text-[11px] tracking-[0.3em] uppercase font-medium transition-all duration-300 disabled:opacity-50"
        style={{ background: "var(--color-gold)", color: "#000" }}
      >
        {state === "loading" ? "Sending…" : "Send Message →"}
      </button>
    </form>
  );
}
