/**
 * Generate a server-side hash based on Request headers
 */
export async function generateServerFingerprint(ip: string, userAgent: string): Promise<string> {
  const data = new TextEncoder().encode(`${ip}-${userAgent}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
