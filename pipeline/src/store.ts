/**
 * 檔案型儲存（驗證期不需要資料庫；資料直接 commit 回 repo）。
 * data/seen.json        已處理過的貼文 id（去重）
 * data/quota.json       keyword search 呼叫時間戳（滾動 7 天 ≤ QUOTA_LIMIT）
 * data/posts/YYYY-MM-DD.json   當日分類結果
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { ThreadsPost } from "./threads.js";
import type { Classification } from "./classify.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = join(ROOT, "data");

/** 官方上限 500/7天，預留緩衝避免踩線 */
export const QUOTA_LIMIT = 450;
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
const SEEN_CAP = 20000;

export interface LoggedPost {
  post: ThreadsPost;
  classification: Classification;
  keyword: string;
  logged_at: string;
}

function readJson<T>(path: string, fallback: T): T {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function writeJson(path: string, value: unknown): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(value, null, 2) + "\n");
}

export function taipeiDate(d = new Date()): string {
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Taipei" }); // YYYY-MM-DD
}

// --- 去重 ---
export function loadSeen(): Set<string> {
  return new Set(readJson<string[]>(join(DATA, "seen.json"), []));
}
export function saveSeen(seen: Set<string>): void {
  writeJson(join(DATA, "seen.json"), [...seen].slice(-SEEN_CAP));
}

// --- quota ---
export function quotaRemaining(): number {
  const cutoff = Date.now() - SEVEN_DAYS;
  const stamps = readJson<number[]>(join(DATA, "quota.json"), []).filter((t) => t > cutoff);
  return QUOTA_LIMIT - stamps.length;
}
export function recordQuery(): void {
  const cutoff = Date.now() - SEVEN_DAYS;
  const stamps = readJson<number[]>(join(DATA, "quota.json"), []).filter((t) => t > cutoff);
  stamps.push(Date.now());
  writeJson(join(DATA, "quota.json"), stamps);
}

// --- 當日結果 ---
export function appendPosts(entries: LoggedPost[]): LoggedPost[] {
  const path = join(DATA, "posts", `${taipeiDate()}.json`);
  const all = readJson<LoggedPost[]>(path, []).concat(entries);
  writeJson(path, all);
  return all;
}
