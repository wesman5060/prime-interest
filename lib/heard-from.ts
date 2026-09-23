/**
 * Answers for the optional "How did you hear about us?" question on the
 * Contact and Acquisitions forms. Stored in the `heard_from` column of both
 * `pi_` submission tables and included in the email to Marty, so we can see
 * which channels actually bring inquiries instead of guessing.
 */
export const HEARD_FROM_OPTIONS = [
  "Google search",
  "Google Maps",
  "Referred by someone",
  "Broker or agent",
  "LinkedIn",
  "Drove by the office or a sign",
  "Other",
] as const;
