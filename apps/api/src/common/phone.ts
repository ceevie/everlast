const DEFAULT_COUNTRY_CODE = "49";

export function toE164(phone?: string | null): string | undefined {
  if (!phone) return undefined;

  const trimmed = phone.trim();
  if (!trimmed) return undefined;

  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 6) return undefined;

  if (hasPlus) return `+${digits}`;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  if (digits.startsWith("0")) return `+${DEFAULT_COUNTRY_CODE}${digits.slice(1)}`;
  if (digits.startsWith(DEFAULT_COUNTRY_CODE)) return `+${digits}`;
  return `+${DEFAULT_COUNTRY_CODE}${digits}`;
}
