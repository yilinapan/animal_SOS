/**
 * 監測管線入口：搜尋 → 去重 → 分類 → 記錄 → 摘要。
 * 執行：cd pipeline && npm run monitor
 * 需要環境變數：THREADS_ACCESS_TOKEN、ANTHROPIC_API_KEY
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { keywordSearch, type ThreadsPost } from "./threads.js";
import { classify } from "./classify.js";
import { loadSeen, saveSeen, quotaRemaining, recordQuery, appendPosts, type LoggedPost } from "./store.js";
import { writeDigest } from "./digest.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MAX_AGE_HOURS = 24; // 只處理 24 小時內的貼文

async function main() {
  const { keywords } = JSON.parse(readFileSync(join(ROOT, "keywords.json"), "utf8")) as { keywords: string[] };
  const seen = loadSeen();
  const fresh: Array<{ post: ThreadsPost; keyword: string }> = [];

  let remaining = quotaRemaining();
  console.log(`本週剩餘 quota: ${remaining}，本輪需要 ${keywords.length} 次查詢`);
  if (remaining < keywords.length) {
    console.error("quota 不足，跳過本輪（避免踩到 Threads 500/7天 上限）");
    process.exit(0);
  }

  for (const kw of keywords) {
    recordQuery();
    remaining--;
    try {
      const posts = await keywordSearch(kw);
      const cutoff = Date.now() - MAX_AGE_HOURS * 3600 * 1000;
      for (const p of posts) {
        if (seen.has(p.id)) continue;
        if (p.timestamp && new Date(p.timestamp).getTime() < cutoff) continue;
        if (p.is_quote_post) continue;
        seen.add(p.id);
        fresh.push({ post: p, keyword: kw });
      }
      console.log(`「${kw}」→ ${posts.length} 篇（新 ${fresh.filter((f) => f.keyword === kw).length} 篇）`);
    } catch (err) {
      console.error(`「${kw}」搜尋失敗:`, err);
    }
  }

  console.log(`共 ${fresh.length} 篇新貼文，開始分類…`);
  const entries: LoggedPost[] = [];
  for (const { post, keyword } of fresh) {
    try {
      const classification = await classify(post);
      entries.push({ post, classification, keyword, logged_at: new Date().toISOString() });
    } catch (err) {
      console.error(`分類失敗 ${post.id}:`, err);
    }
  }

  const dayPosts = appendPosts(entries);
  saveSeen(seen);
  const digestPath = writeDigest(dayPosts, remaining);

  const helpCount = entries.filter((e) => e.classification.is_help_post).length;
  console.log(`完成：新增 ${entries.length} 篇（求助文 ${helpCount} 篇），摘要 → ${digestPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
