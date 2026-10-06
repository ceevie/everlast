export type MetaLeadField = {
  name?: string;
  values?: string[];
};

export type ParsedMetaLead = {
  name: string;
  email?: string;
  phone?: string;
  emailOptIn: boolean;
  whatsappOptIn: boolean;
};

function firstValue(
  fields: Map<string, string[]>,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const value = fields.get(key)?.[0]?.trim();
    if (value) return value;
  }
  return undefined;
}

function isAffirmative(value?: string): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return ["yes", "true", "1", "ja", "on", "checked"].includes(normalized);
}

export function parseMetaLeadFields(
  fieldData: MetaLeadField[] | undefined,
  fallbackName: string,
): ParsedMetaLead {
  const fields = new Map<string, string[]>();
  for (const field of fieldData ?? []) {
    if (!field.name) continue;
    fields.set(field.name.toLowerCase(), field.values ?? []);
  }

  const firstName = firstValue(fields, ["first_name", "vorname"]);
  const lastName = firstValue(fields, ["last_name", "nachname"]);
  const fullName = firstValue(fields, ["full_name", "name", "full name"]);
  const email = firstValue(fields, ["email", "work_email", "e-mail"]);
  const phone = firstValue(fields, [
    "phone_number",
    "phone",
    "mobile",
    "mobil",
    "telefon",
  ]);

  let whatsappOptIn = false;
  for (const [name, values] of fields.entries()) {
    if (name.includes("whatsapp") && isAffirmative(values[0])) {
      whatsappOptIn = true;
    }
  }

  const name =
    fullName ||
    [firstName, lastName].filter(Boolean).join(" ").trim() ||
    fallbackName;

  return {
    name,
    email,
    phone,
    emailOptIn: Boolean(email),
    whatsappOptIn,
  };
}
