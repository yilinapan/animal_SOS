/** 產生每日摘要 digests/YYYY-MM-DD.md（自動區由資料重新生成；分隔線以下的人工紀錄區保留不覆蓋）。 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { taipeiDate, type LoggedPost } from "./store.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const MANUAL_MARKER = "<!-- 人工紀錄區：此行以下不會被自動覆蓋 -->";

/** 為每篇新求助文插入一行待填欄位（已存在的行不重複新增）。 */
function buildManualTemplate(help: LoggedPost[], existing: string): string {
  const lines = existing ? existing.split("\n") : [];
  const header = lines.length
    ? existing
    : `## 人工檢查紀錄（驗證期指標）\n\n缺口 = 發文後 2 小時內有沒有人給出可行動的正確資訊\n回覆品質：沒人理 / 錯誤建議 / 部分正確 / 完整正確\n`;

  const toAdd = help
    .filter((e) => {
      const id = e.post.id;
      return !existing.includes(id);
    })
    .map((e) => {
      const username = e.post.username ? `@${e.post.username}` : e.post.id;
      const link = e.post.permalink ? ` [→](${e.post.permalink})` : "";
      return `- [ ] ${username}${link}（${e.classification.case_type}｜${e.classification.region ?? "地區不明"}）：缺口？　回覆品質？　手動回覆？ <!-- id:${e.post.id} -->`;
    });

  if (!toAdd.length) return header;
  return header.trimEnd() + "\n\n" + toAdd.join("\n") + "\n";
}

export function writeDigest(dayPosts: LoggedPost[], quotaLeft: number): string {
  const date = taipeiDate();
  const path = join(ROOT, "digests", `${date}.md`);

  // 保留既有檔案中分隔線以下的人工紀錄
  let existingManual = "";
  if (existsSync(path)) {
    const raw = readFileSync(path, "utf8");
    const idx = raw.indexOf(MANUAL_MARKER);
    if (idx !== -1) existingManual = raw.slice(idx + MANUAL_MARKER.length).trim();
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

  const manualSection = buildManualTemplate(help, existingManual);
  lines.push("", MANUAL_MARKER, "", manualSection, "");

  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, lines.join("\n"));
  return path;
}
