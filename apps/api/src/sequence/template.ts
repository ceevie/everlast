type LeadVars = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function interpolate(
  template: string,
  lead: LeadVars,
  options?: { html?: boolean },
): string {
  const vars: Record<string, string> = {
    name: lead.name ?? "",
    email: lead.email ?? "",
    phone: lead.phone ?? "",
  };

  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => {
    const value = vars[key] ?? "";
    return options?.html ? escapeHtml(value) : value;
  });
}

export function toHtml(body: string): string {
  return `<p>${body.replace(/\n/g, "<br/>")}</p>`;
}

export function previewText(body: string, max = 180): string {
  const flat = body.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max)}…` : flat;
}
