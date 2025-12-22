import crypto from 'crypto';

// app/_lib/pii.ts

/**
 * Sanitizes input text by replacing known PII (names) with placeholder tokens.
 *
 * @param text The input text possibly containing PII.
 * @param names A list of names to identify and replace as PII.
 * @returns An object containing the sanitized text and a map of tokens to original names.
 */
export function sanitizeTextWithPII(text: string, names: string[]): { sanitizedText: string; piiMap: Map<string, string> } {
  let sanitizedText = text;
  const piiMap = new Map<string, string>();
  
  names.forEach((name) => {
    // Escape special characters in the name for use in a regular expression
    const escapedName = name.replace(/[.*+?^${}()|[\\]/g, '\\$&');
    // eslint-disable-next-line security/detect-non-literal-regexp
    const regex = new RegExp(`\\b${escapedName}\\b`, 'gi'); // 'gi' for global, case-insensitive
    const token = `[PII_${crypto.randomUUID()}]`;
    
    // Replace name with token
    sanitizedText = sanitizedText.replace(regex, token);
    // Store mapping
    piiMap.set(token, name);
  });

  return { sanitizedText, piiMap };
}

/**
 * Re-hydrates text by replacing placeholder tokens with original PII (names).
 *
 * @param text The text containing placeholder tokens.
 * @param piiMap A map of tokens to original names.
 * @returns The re-hydrated text with original PII.
 */
export function rehydrateTextWithPII(text: string, piiMap: Map<string, string>): string {
  let rehydratedText = text;
  piiMap.forEach((originalName, token) => {
    // Escape special characters in the token for use in a regular expression
    const escapedToken = token.replace(/[.*+?^${}()|[\\]/g, '\\$&');
    // eslint-disable-next-line security/detect-non-literal-regexp
    const regex = new RegExp(escapedToken, 'g'); // 'g' for global
    rehydratedText = rehydratedText.replace(regex, originalName);
  });
  return rehydratedText;
}

/**
 * Re-hydrates an array of assigned roles by replacing placeholder tokens with original PII (names).
 *
 * @param roles The array of assigned roles, where assignee names might be tokens.
 * @param piiMap A map of tokens to original names.
 * @returns The array of assigned roles with original PII.
 */
export function rehydrateAssignedRoles(roles: Array<{ id: string; role: string; assignee: string | null }>, piiMap: Map<string, string>): Array<{ id: string; role: string; assignee: string | null }> {
  return roles.map(role => ({
    ...role,
    assignee: role.assignee ? (piiMap.get(role.assignee) || role.assignee) : null,
  }));
}
