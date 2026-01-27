This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.





------------------------------------------------------------------------------------
------------------------------------------------------------------------------------
src/
 ├─ services/
 │   ├─ auth.service.ts
 │   ├─ user.service.ts
 │   ├─ car.service.ts
 │   ├─ bid.service.ts
 │   ├─ admin.service.ts


------------------------------------------------------------------------------------
------------------------------------------------------------------------------------

F:\Devonsite\Project\car_trading_market\next-frontend\src\services\auth.service.ts

import { API } from "@/src/lib/api/endpoints";
import { POST } from "../lib/api/post.service";


export const login = async (data: {
  email: string;
  password: string;
}) => {
  
  const res:any = await POST(API.auth.login, data);
  console.log("API.auth.login: ", API.auth.login, res);
  
  return res;
};


export const signup = async (data: any) => {
  
  const res:any = await POST(API.auth.signup, data);
  console.log("API.auth.signup: ", API.auth.signup, res);
  
  return res;
};

export const logoutService = async () => {
  return POST(API.auth.logout, {});
};

F:\Devonsite\Project\car_trading_market\next-frontend\src\services\user.service.ts

import { API } from "@/src/lib/api/endpoints";
import { GET } from "../lib/api/get.service";

export interface User {
  id: number;
  name: string;
  email: string;
}

export const getUserProfile = () => {
  return GET<User>(API.user.profile);
};

F:\Devonsite\Project\car_trading_market\next-frontend\src\app\api\proxy\[...path]\route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function forward(req: NextRequest, path: string[]) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const url = new URL(`${API_BASE_URL}/${path.join("/")}`);

  // Forward query params
  req.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  // Detect content-type
  const contentType = req.headers.get("content-type") || "";

  let body: any;
  if (req.method !== "GET" && req.method !== "HEAD") {
    if (contentType.includes("application/json")) {
      // JSON request
      body = JSON.stringify(await req.json());
      headers["Content-Type"] = "application/json";
    } else {
      // Other (FormData / multipart)
      body = await req.arrayBuffer(); // send raw bytes
      headers["Content-Type"] = contentType;
    }
  }

  const res = await fetch(url.toString(), {
    method: req.method,
    headers,
    body,
    credentials: "include",
  });

  return res;
}


export async function POST(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const res = await forward(req, path);
  return new NextResponse(res.body, res);
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const res = await forward(req, path);
  return new NextResponse(res.body, res);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const res = await forward(req, path);
  return new NextResponse(res.body, res);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const res = await forward(req, path);
  return new NextResponse(res.body, res);
}
F:\Devonsite\Project\car_trading_market\next-frontend\src\lib\api\apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api/proxy",
  withCredentials: true,
  // headers: {
  //   "Content-Type": "application/json",
  //   Accept: "application/json",
  // },
});

let isRefreshing = false;
let queue: any[] = [];

apiClient.interceptors.response.use(
  (res) => res.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          await axios.post("/api/proxy/auth/refresh", {}, {
            withCredentials: true,
          });

          queue.forEach((cb) => cb());
          queue = [];
        } catch {
          window.location.href = "/auth/login";
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve) => {
        queue.push(() => resolve(apiClient(originalRequest)));
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
F:\Devonsite\Project\car_trading_market\next-frontend\src\lib\api\endpoints.ts
export const API = {
  auth: {
    login: "/login",
    signup: "/signup",
    logout: "/logout",
    refresh: "/auth/refresh",
  },
  user: {
    profile: "/user",
  },
  cars: {
    create: "/cars",   
    myCars: "/my-cars",
  },
};
F:\Devonsite\Project\car_trading_market\next-frontend\src\lib\api\get.service.ts
// lib/api/get.service.ts
import apiClient from "./apiClient";

export const GET = <T>(url: string, params?: any): Promise<T> =>
  apiClient.get(url, { params });
F:\Devonsite\Project\car_trading_market\next-frontend\src\lib\api\post.service.ts
// lib/api/post.service.ts
import apiClient from "./apiClient";

export const POST = <T>(url: string, data?: any): Promise<T> =>
  apiClient.post(url, data);
F:\Devonsite\Project\car_trading_market\next-frontend\src\lib\auth\auth.actions.ts
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
  setAuthCookies({
    access_token: res.access_token,
    refresh_token: res.refresh_token,
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
  });

  return res.user;
}

F:\Devonsite\Project\car_trading_market\next-frontend\src\lib\auth\cookies.ts
import { cookies } from "next/headers";

export async function setAuthCookies(tokens: {
  access_token: string;
  refresh_token: string;
}) {
  const cookieStore = await cookies();

  cookieStore.set("access_token", tokens.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  cookieStore.set("refresh_token", tokens.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}

