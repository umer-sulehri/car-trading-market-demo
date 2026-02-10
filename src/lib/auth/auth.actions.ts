"use server";

import { cookies } from "next/headers";
import { clearAuthCookies, setAuthCookies } from "./cookies";

export async function setAuthToken(token: string) {
  (await cookies()).set("access_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });
}

export async function removeAuthToken() {
  (await cookies()).delete("access_token");
}

export async function handleLoginResponse(res: any) {
  await setAuthCookies({
    access_token: res.access_token,
    refresh_token: res.refresh_token,
    user: res.user,
  });

  return res.user;
}

export async function logout() {
  await clearAuthCookies();
}

export async function handleAuthResponse(res: any) {
  await setAuthCookies({
    access_token: res.access_token,
    refresh_token: res.refresh_token,
    user: res.user,
  });

  return res.user;
}

