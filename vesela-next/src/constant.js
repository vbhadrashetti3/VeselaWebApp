// Authentication: access token in sessionStorage (via tokenManager); refresh in HttpOnly cookie
export const USER_DETAILS = "userdetails";
export const PLAN_DETAILS = "plan_details";
export const POST_LOGIN_NAVIGATE_TO = "postLoginNavigateTo";
// Set to "true" once the user has visited /welcome, so ClientRedirect
// knows to send them to /chat instead of /welcome on future visits.
export const WELCOME_COMPLETED = "welcomeCompleted";
export const ASSESSMENT_STORAGE_KEY = "assessmentData";
// Free-plan daily cap lock. Value is the UTC date (YYYY-MM-DD) it was set.
export const AUTH_LIMIT_LOCKED = "vesela_auth_limit_locked";
// SessionStorage: expired session should open the login modal on the home page.
export const PROMPT_LOGIN = "vesela_prompt_login";

// Golden Ratio layout: conversation takes φ/(1+φ) ≈ 61.8% of viewport
// clamp(min, fluid, max) — scales from mobile comfort to ultrawide cap
export const CHAT_CONTAINER_MAX_WIDTH = "clamp(480px, 61.8vw, 960px)";