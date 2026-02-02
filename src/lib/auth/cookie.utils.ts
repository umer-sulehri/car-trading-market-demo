/**
 * Utility function to get authentication token from cookies
 * Reads the access_token cookie set by the auth system
 */
export const getAuthTokenFromCookie = (): string | null => {
  if (typeof document === "undefined") return null;

  const name = "access_token=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  for (let cookie of cookieArray) {
    cookie = cookie.trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length);
    }
  }

  return null;
};

/**
 * Utility function to check if user is authenticated
 * Calls server endpoint to check httpOnly cookies
 */
export const isUserAuthenticated = async (): Promise<boolean> => {
  try {
    if (typeof document === "undefined") return false;
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include", // Send cookies with request
    });
    const data = await response.json();
    console.log("🍪 Server Auth Check - Authenticated:", data.authenticated);
    return data.authenticated === true;
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
};

/**
 * Utility function to set auth token in cookie
 * Note: In production, set auth cookies from backend for security
 */
export const setAuthTokenInCookie = (token: string, days: number = 7): void => {
  if (typeof document === "undefined") return;

  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  
  document.cookie = `access_token=${token};${expires};path=/;SameSite=Lax`;
};

/**
 * Utility function to remove auth token from cookie
 */
export const removeAuthTokenFromCookie = (): void => {
  if (typeof document === "undefined") return;

  document.cookie = "access_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
  document.cookie = "refresh_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
};
