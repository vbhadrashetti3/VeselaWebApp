/**
 * Request payload for POST /dj-rest-auth/password/change/
 */
export interface ChangePasswordPayload {
  old_password: string;
  new_password1: string;
  new_password2: string;
}

/**
 * Response format returned by dj-rest-auth password change endpoint
 */
export interface ChangePasswordResponse {
  status?: number;
  data?: {
    detail?: string;
    old_password?: string[];
    new_password1?: string[];
    new_password2?: string[];
    non_field_errors?: string[];
    [key: string]: any;
  } | null;
  error?: boolean;
  message?: string;
}
