type TripIdentifierSource = {
  id?: string | number | null | undefined;
  title?: string | null | undefined;
};

const slugifyTitle = (title: string): string =>
  encodeURIComponent(
    title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
  );

export const getTripIdentifier = (trip: TripIdentifierSource): string | null => {
  if (trip.id !== undefined && trip.id !== null && String(trip.id).trim() !== "") {
    return String(trip.id);
  }

  if (trip.title && trip.title.trim() !== "") {
    return slugifyTitle(trip.title);
  }

  return null;
};

export const matchesTripIdentifier = (
  trip: TripIdentifierSource,
  identifier: string
): boolean => {
  const normalizedIdentifier = identifier?.toString().trim();
  if (!normalizedIdentifier) return false;

  const tripId = trip.id;
  if (tripId !== undefined && tripId !== null && String(tripId) === normalizedIdentifier) {
    return true;
  }

  const slug = trip.title && trip.title.trim() !== "" ? slugifyTitle(trip.title) : null;
  return slug === normalizedIdentifier;
};

