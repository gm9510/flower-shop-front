import { auth } from "@clerk/nextjs/server";

/**
 * Get Clerk authentication token for server-side API calls
 * Use this in Server Components, Route Handlers, and Server Actions
 */
export async function getClerkToken(): Promise<string | null> {
  const { getToken } = await auth();
  return getToken();
}

/**
 * Get user ID from Clerk auth on server-side
 */
export async function getClerkUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}
