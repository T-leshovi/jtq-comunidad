/**
 * Generate a non-sequential folio from a registration ID.
 * Uses Knuth multiplicative hash to produce codes that appear random
 * but are deterministic (same ID always produces same folio).
 */
export function generateFolio(id: number): string {
  // Knuth multiplicative hash
  const hash = ((id * 2654435761) >>> 0) % (1 << 24)
  const code = hash.toString(36).toUpperCase().padStart(5, "0")
  return `JTQ-${code}`
}
