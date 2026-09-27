const STORAGE_KEY = "konga2_bookings";

export function readStoredBookings() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredBooking(booking) {
  const bookings = readStoredBookings();
  const entry = {
    id: `local-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    created_at: new Date().toISOString(),
    ...booking,
  };

  bookings.push(entry);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }

  return entry;
}

export function isSupabaseTableMissingError(error) {
  const message = error?.message || "";
  return /Could not find table|schema cache|does not exist|relation .* does not exist/i.test(message);
}
