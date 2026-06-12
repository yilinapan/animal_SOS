/**
 * Threads API client（開發模式、單一帳號）。
 * 文件: https://developers.facebook.com/docs/threads/keyword-search
 * quota: keyword search 500 次 / 滾動 7 天 — 呼叫端必須先檢查 quota（見 store.ts）。
 */

const BASE = "https://graph.threads.net/v1.0";

export interface ThreadsPost {
  id: string;
  text?: string;
  username?: string;
  permalink?: string;
  timestamp?: string;
  media_type?: string;
  media_url?: string;
  is_quote_post?: boolean;
}

function token(): string {
  const t = process.env.THREADS_ACCESS_TOKEN;
  if (!t) throw new Error("缺少環境變數 THREADS_ACCESS_TOKEN（GitHub repo Settings → Secrets 設定後由 workflow 注入）");
  return t;
}

async function get(path: string, params: Record<string, string>): Promise<any> {
  const qs = new URLSearchParams({ ...params, access_token: token() });
  const res = await fetch(`${BASE}${path}?${qs}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Threads API ${res.status} ${path}: ${JSON.stringify(body?.error ?? body)}`);
  }
  return body;
}

/** 關鍵字搜尋公開貼文（RECENT 排序）。每次呼叫消耗 1 個 quota。 */
export async function keywordSearch(q: string): Promise<ThreadsPost[]> {
  const body = await get("/keyword_search", {
    q,
    search_type: "RECENT",
    fields: "id,text,username,permalink,timestamp,media_type,media_url,is_quote_post",
  });
  return (body.data ?? []) as ThreadsPost[];
}

/**
 * 長效 token 續期（長效 token 有效 60 天，發出 24 小時後即可 refresh）。
 * 回傳新 token；workflow 會把它印出來提醒人工更新 Secret（自動回寫 Secret 需另設 PAT，先不做）。
 */
export async function refreshToken(): Promise<{ access_token: string; expires_in: number }> {
  const body = await get("/refresh_access_token", { grant_type: "th_refresh_token" });
  return body;
}
