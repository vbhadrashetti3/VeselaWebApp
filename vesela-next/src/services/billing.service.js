import { get } from "@/lib/apiService";
import { getCurrentBrand } from "@/utils/brandUtil";

/**
 * Fetches the Stripe customer billing portal URL for the current user and brand.
 * Uses the authenticated API client.
 * 
 * GET /api/customer_billing_portal/?brand=<current_brand>
 * 
 * @returns {Promise<{ status?: string, url?: string, expired?: boolean, error?: boolean, message?: string }>}
 */
export const getCustomerBillingPortal = async () => {
  const brand = getCurrentBrand();
  return get("/api/customer_billing_portal/", { brand });
};
