import { POST } from '@/src/lib/api/post.service';
import { handleAuthResponse } from '@/src/lib/auth/auth.actions';

interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface VerifyEmailPayload {
  token: string;
}

interface ResendVerificationPayload {
  email: string;
}

export const authService = {
  /**
   * Sign up a new user
   */
  async signup(data: SignupPayload) {
    const response = await POST<any>('/signup', data);
    await handleAuthResponse(response);
    return response.user;
  },

  /**
   * Log in a user
   */
  async login(data: LoginPayload) {
    const response = await POST<any>('/login', data);
    await handleAuthResponse(response);
    return response.user;
  },

  /**
   * Verify email address with token
   */
  async verifyEmail(token: string) {
    const response = await POST<any>('/auth/verify-email', {
      token,
    });
    return response;
  },

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string) {
    const response = await POST<any>('/auth/resend-verification-email', {
      email,
    });
    return response;
  },

  /**
   * Refresh access token
   */
  async refreshToken() {
    const response = await POST<any>('/auth/refresh');
    return response.access_token;
  },
};
