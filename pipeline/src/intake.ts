/**
 * 手動收件匣：keyword_search 通過 App Review 之前的半自動入口。
 * 使用流程：滑 Threads 看到求助文 → 把連結（與內文）貼進 pipeline/inbox.md
 * → commit → workflow 自動分類、併入當日資料與摘要，然後清空收件匣。
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { classify, type Classification } from "./classify.js";
import type { ThreadsPost } from "./threads.js";
import type { LoggedPost } from "./store.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const INBOX = join(ROOT, "inbox.md");

export const INBOX_TEMPLATE = `# 手動收件匣

滑 Threads 看到求助文 → 貼文右上角分享 → 複製連結 → 貼到下面。
連結的下一行可以貼內文（有內文 AI 才能自動分類；只有連結也行，會標成待人工判讀）。
一行連結算一則，commit 之後 workflow 會自動處理並清空這個檔案。

<!-- 範例（不會被處理）：
https://www.threads.com/@someone/post/ABC123
撿到一隻幼鳥，在台中，怎麼辦？
-->
`;

interface InboxEntry {
  url: string;
  text: string;
  username?: string;
  id: string;
}

/** 一行 Threads 連結開啟一則新 entry，其後的非連結行視為該則內文。 */
export function parseInbox(raw: string): InboxEntry[] {
  const body = raw.replace(/<!--[\s\S]*?-->/g, "");
  const entries: InboxEntry[] = [];
  let current: InboxEntry | null = null;

  for (const rawLine of body.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || /^-{3,}$/.test(line)) continue;
    const isThreadsUrl = /^https?:\/\/(www\.)?threads\.(com|net)\//.test(line);
    if (isThreadsUrl) {
      const id = line.match(/\/post\/([A-Za-z0-9_-]+)/)?.[1] ?? line;
      const username = line.match(/threads\.(?:com|net)\/@([\w.]+)/)?.[1];
      current = { url: line, text: "", username, id: `manual:${id}` };
      entries.push(current);
    } else if (current) {
      current.text += (current.text ? "\n" : "") + line;
    }
  }
  return entries;
}

/**
 * 處理收件匣：分類新貼文並回傳 LoggedPost。
 * 全部成功才清空收件匣；有任何分類失敗就保留原檔，下一輪重試。
 */
export async function processInbox(seen: Set<string>): Promise<LoggedPost[]> {
  if (!existsSync(INBOX)) {
    writeFileSync(INBOX, INBOX_TEMPLATE);
    return [];
  }
  const entries = parseInbox(readFileSync(INBOX, "utf8"));
  if (entries.length === 0) return [];

  const out: LoggedPost[] = [];
  let failed = false;

  for (const e of entries) {
    if (seen.has(e.id)) continue;
    const post: ThreadsPost = {
      id: e.id,
      text: e.text || undefined,
      username: e.username,
      permalink: e.url,
    };
    try {
      const classification: Classification = e.text
        ? await classify(post)
        : { is_help_post: true, case_type: "不明動物", region: null, urgency: 1, reason: "只有連結沒有內文，請人工點開判讀" };
      seen.add(e.id);
      out.push({ post, classification, keyword: "手動收件匣", logged_at: new Date().toISOString() });
    } catch (err) {
      failed = true;
      console.error(`收件匣分類失敗 ${e.url}:`, err);
    }
  }

  if (!failed) writeFileSync(INBOX, INBOX_TEMPLATE);
  console.log(`收件匣：處理 ${out.length} 則${failed ? "（有失敗，保留原檔下輪重試）" : ""}`);
  return out;
}
