/**
 * Appends prefilled_email and client_reference_id (user ID) query parameters
 * to a Stripe payment link URL for webhook tracking.
 *
 * Example output:
 * https://buy.stripe.com/5kQ8wPdcV75TfOrf3b24007?prefilled_email=vijay@google.com&client_reference_id=3333333
 *
 * @param {string} baseUrl - Base Stripe Payment Link URL
 * @param {object|null} user - User object containing email and pk/id
 * @returns {string} Formatted Stripe payment link URL
 */
export function getStripePaymentUrl(baseUrl, user) {
  if (!baseUrl) return "";
  try {
    const url = new URL(baseUrl);
    const email = user?.email;
    const userId = user?.pk ?? user?.id;

    if (email) {
      url.searchParams.set("prefilled_email", email);
    }
    if (userId !== null && userId !== undefined) {
      url.searchParams.set("client_reference_id", String(userId));
    }
    return url.toString();
  } catch {
    return baseUrl;
  }
}
