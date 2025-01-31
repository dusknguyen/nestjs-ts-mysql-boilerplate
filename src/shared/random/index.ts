/**
 * Generates a random number between 1 and 999999 (inclusive).
 *
 * @returns A random number between 1 and 999999.
 */
export function randomNumber(): number {
  const max = 999999;
  const min = 1;
  return Math.floor(Math.random() * (max - min + 1)) + min; // Adjusted to include 'max' value.
}

/**
 * Generates a random number between 'from' and 'to' (inclusive).
 *
 * @param from The lower bound of the range.
 * @param to The upper bound of the range.
 * @returns A random number within the given range.
 */
export const randomInRange = (from: number, to: number): number => {
  if (from > to) return 0; // Return 0 if 'from' is greater than 'to'
  return Math.ceil(Math.random() * (to * 1000000 - from * 1000000) + from * 1000000) / 1000000; // To ensure accurate range
};

/**
 * Picks a random item from the provided list.
 *
 * @param list The array to pick a random item from.
 * @returns A random item from the list, or null if the list is empty.
 */
export const pickOneFromList = <T>(list: T[]): T | null => {
  if (list && list.length > 0) {
    return list[Math.floor(Math.random() * list.length)]; // Randomly pick an item
  }
  return null; // Return null if the list is empty
};
