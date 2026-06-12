/**
 * 用 Claude 對 Threads 貼文做分類。
 * 設計原則（見 docs/planning/00-next-steps.md）：AI 只做「判斷」，
 * 不生成任何聯絡資訊；回覆內容未來由知識庫模板組裝。
 */
import Anthropic from "@anthropic-ai/sdk";
import type { ThreadsPost } from "./threads.js";

const MODEL = "claude-haiku-4-5-20251001";

export const CASE_TYPES = [
  "幼鳥雛鳥",
  "路殺",
  "大體處理",
  "蛇",
  "受傷犬貓",
  "受傷野生動物",
  "受困",
  "走失協尋",
  "不明動物",
  "其他求助",
  "無關",
] as const;

export interface Classification {
  is_help_post: boolean;
  case_type: (typeof CASE_TYPES)[number];
  region: string | null;
  urgency: 1 | 2 | 3;
  reason: string;
}

const SYSTEM = `你是「動物幫幫 Animal SOS」的貼文分類器。判斷一則 Threads 公開貼文是否為「遇到動物事件、需要資訊或協助」的真實求助／詢問文。

分類規則:
- is_help_post: 發文者本人遇到動物事件且需要資訊協助才算 true。新聞轉貼、閒聊、炫耀寵物、單純感嘆、廣告、轉發他人案件皆為 false。
- case_type 從這個清單擇一: ${CASE_TYPES.join("、")}。
- region: 從文中推斷縣市（如「台中」），無法推斷給 null。不要猜。
- urgency: 3=動物生命危急或有人身安全疑慮(蛇在室內)；2=需要儘快處理；1=資訊詢問、不急。
- reason: 一句話說明判斷依據。

只輸出 JSON，不要任何其他文字: {"is_help_post":bool,"case_type":"...","region":"...或null","urgency":1|2|3,"reason":"..."}`;

const client = new Anthropic(); // 讀 ANTHROPIC_API_KEY 環境變數

export async function classify(post: ThreadsPost): Promise<Classification> {
  const content = `貼文作者: @${post.username ?? "unknown"}
發文時間: ${post.timestamp ?? "unknown"}
媒體: ${post.media_type ?? "無"}
內文:
${(post.text ?? "").slice(0, 2000)}`;

  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 300,
    system: SYSTEM,
    messages: [{ role: "user", content }],
  });

  const text = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  try {
    const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
    return {
      is_help_post: Boolean(json.is_help_post),
      case_type: CASE_TYPES.includes(json.case_type) ? json.case_type : "其他求助",
      region: json.region === "null" ? null : (json.region ?? null),
      urgency: [1, 2, 3].includes(json.urgency) ? json.urgency : 1,
      reason: String(json.reason ?? ""),
    };
  } catch {
    // 解析失敗一律保守處理：標成需要人工看的「不明動物」而不是丟棄
    return { is_help_post: true, case_type: "不明動物", region: null, urgency: 1, reason: `分類器輸出無法解析: ${text.slice(0, 100)}` };
  }
}
