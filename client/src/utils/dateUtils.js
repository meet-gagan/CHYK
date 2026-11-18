/**
 * Calculate age accurately from Date of Birth (YYYY-MM-DD string or Date object)
 * Returns age in years, or null if invalid or in future
 */
export const calculateAgeFromDob = (dob) => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
};

/**
 * Returns today's date in YYYY-MM-DD string for input max attribute
 */
export const getMaxDobDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Returns minimum allowable date for Seva/Pooja booking in YYYY-MM-DD.
 * Bookings must be made at least 2 days in advance (day after tomorrow onwards).
 * Past dates, present date (today), and tomorrow are unavailable.
 * E.g., if today is 18th Nov, bookings are only open from 20th Nov onwards (17th, 18th, 19th unavailable).
 */
export const getMinSevaDate = () => {
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 2);
  const year = minDate.getFullYear();
  const month = String(minDate.getMonth() + 1).padStart(2, '0');
  const day = String(minDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
