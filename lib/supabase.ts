import { createClient } from "@supabase/supabase-js";

/**
 * Anonymous client used from the public site to write form submissions to
 * the `pi_acquisition_submissions` and `pi_contact_submissions` tables.
 *
 * The publishable key is safe to expose — Row Level Security on the tables
 * only permits INSERT, never SELECT/UPDATE/DELETE. Marty reviews submissions
 * by signing into the Supabase dashboard as the project owner.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabase =
  url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;

export const SUPABASE_CONFIGURED = Boolean(url && key);

export interface AcquisitionSubmissionInput {
  role: "owner" | "broker" | "investor";
  name: string;
  email: string;
  phone?: string;
  location: string;
  acreage?: string;
  price?: string;
  timeline?: string;
  notes?: string;
  source?: string;
}

export interface ContactSubmissionInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}

export async function submitAcquisition(input: AcquisitionSubmissionInput) {
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase
    .from("pi_acquisition_submissions")
    .insert([input]);
  if (error) throw new Error(error.message);
}

export async function submitContact(input: ContactSubmissionInput) {
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase
    .from("pi_contact_submissions")
    .insert([input]);
  if (error) throw new Error(error.message);
}
