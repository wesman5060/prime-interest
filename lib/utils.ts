import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Fit text to a <meta name="description">. Google cuts search snippets off
 * around 155-160 characters, so longer text is clipped at a word boundary
 * with an ellipsis instead of mid-word by Google.
 */
export function clampDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(" ")
  const head = lastSpace > 0 ? cut.slice(0, lastSpace) : cut
  return `${head.replace(/[\s,;:.—–-]+$/, "")}…`
}
