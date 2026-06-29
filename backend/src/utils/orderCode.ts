export function generateOrderCode(prefix: string): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // "20260630"
  const random = Math.random().toString(36).substring(2, 8).toUpperCase(); // "X7K2M9"
  return `${prefix}-${date}-${random}`; // "EVT-20260630-X7K2M9"
}
