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
