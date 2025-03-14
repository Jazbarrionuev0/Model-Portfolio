"use server";

import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export async function createCookie(key: string, value: string) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: key,
    value,
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteCookie(key: string) {
  (await cookies()).delete({
    name: key,
    path: "/",
  });
}

export async function getCookie(key: string): Promise<RequestCookie | undefined> {
  return (await cookies()).get(key);
}

export async function getUserIdFromCookie(key: string): Promise<string | undefined> {
  const cookie = await getCookie(key);
  return cookie?.value;
}
