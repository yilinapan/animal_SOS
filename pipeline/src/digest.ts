/** 產生每日摘要 digests/YYYY-MM-DD.md（自動區由資料重新生成；分隔線以下的人工紀錄區保留不覆蓋）。 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { taipeiDate, type LoggedPost } from "./store.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const MANUAL_MARKER = "<!-- 人工紀錄區：此行以下不會被自動覆蓋 -->";

const MANUAL_TEMPLATE = `## 人工檢查紀錄（驗證期指標）

每篇求助文記三件事：缺口（2小時內有無正確資訊）、回覆品質（沒人理/錯誤/部分正確/完整正確）、有無手動回覆與原po反應。

- [ ] （範例）@帳號：無缺口，回覆品質完整正確，未手動回覆
`;

export function writeDigest(dayPosts: LoggedPost[], quotaLeft: number): string {
  const date = taipeiDate();
  const path = join(ROOT, "digests", `${date}.md`);

  // 保留既有檔案中分隔線以下的人工紀錄
  let manualSection = MANUAL_TEMPLATE;
  if (existsSync(path)) {
    const existing = readFileSync(path, "utf8");
    const idx = existing.indexOf(MANUAL_MARKER);
    if (idx !== -1) {
      const tail = existing.slice(idx + MANUAL_MARKER.length).trim();
      if (tail) manualSection = tail;
    }
  }

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

  lines.push("", MANUAL_MARKER, "", manualSection, "");

  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, lines.join("\n"));
  return path;
}
