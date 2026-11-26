import { router } from "expo-router";
import { getToken, removeToken } from "@/lib/token";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// 로그인 토큰을 붙여 GET. 토큰이 만료됐으면 첫 화면으로 보내고 null 을 돌려줌
export async function getJson<T>(path: string): Promise<T | null> {
  const token = await getToken();
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) {
    await removeToken();
    router.replace("/");
    return null;
  }
  if (!res.ok) throw new Error(`${path} status ${res.status}`);
  return res.json();
}

// 로그인 토큰을 붙여 JSON body 로 POST. 401 처리는 getJson 과 같음
export async function postJson<T>(path: string, body: unknown): Promise<T | null> {
  const token = await getToken();
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (res.status === 401) {
    await removeToken();
    router.replace("/");
    return null;
  }
  if (!res.ok) throw new Error(`${path} status ${res.status}`);
  return res.json();
}
