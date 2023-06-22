const BASE_URL = process.env.serverHost;
export const LOGIN_ENDPOINT = `${BASE_URL}/api/v2/auth/reporting/login`;
export const LOGOUT_ENDPOINT = `${BASE_URL}/api/v2/auth/reporting/logout`;
export const PASSWORD_REQUEST_ENDPOINT = `${BASE_URL}/api/v2/auth/reporting/forgot-password-send-code`;
export const AGENT_EVENTS_ENDPOINT = `${BASE_URL}/api/v2/reporting/events`;
export const PASSWORD_VERIFY_ENDPOINT = `${process.env.serverHost}/api/v2/auth/reporting/verify-forgot-password-code`;
export const PASSWORD_RESET_ENDPOINT = `${process.env.serverHost}/api/v2/auth/reporting/reset-password`;
