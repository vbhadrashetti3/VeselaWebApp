/**
 * HubSpot Server-side Client
 * Securely communicates with the HubSpot API on the server.
 * Ensures HUBSPOT_ACCESS_TOKEN is never exposed to the client bundle.
 */

const HUBSPOT_BASE_URL = process.env.HUBSPOT_API_BASE_URL || "https://api.hubapi.com";

/**
 * Fetch helper for HubSpot API endpoints.
 * @param {string} endpoint - Relative path (e.g. '/cms/v3/blogs/posts')
 * @param {Object} [options={}] - Fetch options
 * @returns {Promise<Object>} Response JSON
 */
export async function hubspotFetch(endpoint, options = {}) {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;

  if (!token) {
    throw new Error("HUBSPOT_ACCESS_TOKEN is not defined in environment variables");
  }

  const url = endpoint.startsWith("http") ? endpoint : `${HUBSPOT_BASE_URL}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    // Default to Next.js cache with 1 hour revalidation if not specified
    next: options.next || { revalidate: 3600 },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    let errorMessage = `HubSpot API error: ${response.status} ${response.statusText}`;
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.message) errorMessage = errorJson.message;
    } catch (_) {
      // Keep default error message
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  return response.json();
}
