export function formatRupee(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

export function formatISTDate(iso: string): string {
  if (!iso) return "TBA";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}
