/** Where to go after logging in. Only same-site paths, so a crafted link can't send the customer elsewhere. */
export function safeNextPath(next: string | null): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";
}
