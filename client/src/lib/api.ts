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
