/**
 *
 */
export function randomNumber(): number {
  const max = 999999;
  const min = 1;
  return Math.floor(Math.random() * (max - min) + min);
}
export const randomInRange = (from: number, to: number): number => {
  if (from > to) return 0;
  return Math.ceil(Math.random() * (to * 1000000 - from * 1000000) + from * 1000000) / 1000000;
};
export const pickOneFromList = <T>(list: T[]): T | null => {
  if (list && list.length > 0) {
    return list[Math.floor(Math.random() * list.length)];
  }
  return null;
};
