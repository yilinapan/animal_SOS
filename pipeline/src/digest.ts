/** 產生每日摘要 digests/YYYY-MM-DD.md（由當日全部資料重新生成，可重複執行）。 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { taipeiDate, type LoggedPost } from "./store.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

export function writeDigest(dayPosts: LoggedPost[], quotaLeft: number): string {
  const date = taipeiDate();
  const help = dayPosts.filter((e) => e.classification.is_help_post);
  const byType = new Map<string, LoggedPost[]>();
  for (const e of help) {
    const list = byType.get(e.classification.case_type) ?? [];
    list.push(e);
    byType.set(e.classification.case_type, list);
  }

  const lines: string[] = [
    `# 每日監測摘要 ${date}`,
    "",
    `今日掃描到 **${dayPosts.length}** 篇新貼文，其中 **${help.length}** 篇判定為真實求助文。本週剩餘搜尋 quota：${quotaLeft}。`,
    "",
    `## 案型分布`,
    "",
    ...[...byType.entries()]
      .sort((a, b) => b[1].length - a[1].length)
      .map(([t, list]) => `- ${t}：${list.length} 篇`),
    "",
    `## 求助文清單（依緊急度排序）`,
    "",
    `| 緊急 | 案型 | 地區 | 摘要 | 判斷依據 | 連結 |`,
    `|---|---|---|---|---|---|`,
  ];

  for (const e of [...help].sort((a, b) => b.classification.urgency - a.classification.urgency)) {
    const c = e.classification;
    const snippet = (e.post.text ?? "").replace(/\s+/g, " ").slice(0, 60);
    lines.push(
      `| ${"🔥".repeat(c.urgency)} | ${c.case_type} | ${c.region ?? "—"} | ${snippet} | ${c.reason} | [開啟](${e.post.permalink ?? "#"}) |`,
    );
  }

  lines.push(
    "",
    "## 人工檢查項目（驗證期指標）",
    "",
    "- [ ] 點開每篇連結，標記：發文 2 小時內是否已有「可行動的正確資訊」回覆（缺口判定）",
    "- [ ] 抽查分類是否正確（誤判記下來，作為調整 prompt 的依據）",
    "- [ ] 值得回覆的，用個人帳號手動回覆並記錄原 po 反應",
    "",
  );

  const path = join(ROOT, "digests", `${date}.md`);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, lines.join("\n"));
  return path;
}
