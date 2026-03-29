import crypto from "crypto";

/**
 * Generate a server-side hash based on Request headers
 */
export function generateServerFingerprint(ip: string, userAgent: string): string {
  const data = `${ip}-${userAgent}`;
  return crypto.createHash("sha256").update(data).digest("hex");
}
