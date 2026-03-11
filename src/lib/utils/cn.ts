/**
 * Utility for conditionally joining Tailwind class names.
 * Lightweight alternative to clsx — no dependency needed for basic merging.
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}
