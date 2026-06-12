# Animal SOS 監測管線

驗證期工具：收集 Threads 求助貼文 → AI 分類 → 每日摘要。對應 `docs/planning/00-next-steps.md` 的 P0 需求驗證。

```
手動收件匣（inbox.md）＋ 搜尋（keyword_search, RECENT）
  → 去重（data/seen.json）
  → Claude Haiku 分類（求助文？案型？地區？緊急度？）
  → data/posts/YYYY-MM-DD.json
  → digests/YYYY-MM-DD.md（人工每日只看這份）
```

## 兩種資料來源

| 來源 | 狀態 | 說明 |
|---|---|---|
| 手動收件匣 `inbox.md` | ✅ 可用 | 滑 Threads 看到求助文 → 複製連結（＋內文）貼進去 → commit → 自動分類。**App Review 通過前的主要入口** |
| keyword search | ⏳ 等 App Review | 開發模式只搜得到自己帳號的貼文；公開搜尋需 Advanced Access（見 `docs/setup/threads-app-setup.md`）。可設 repo Variable `THREADS_SEARCH_ENABLED=false` 暫停 |

## 使用

- 自動：`.github/workflows/monitor.yml`（排程 09:00 / 17:00 台北時間；push 改動 `inbox.md` 也會觸發）
- 本機：
  ```bash
  cd pipeline && npm install
  THREADS_ACCESS_TOKEN=... ANTHROPIC_API_KEY=... npm run monitor
  ```

## 手動收件匣流程（每天 5–10 分鐘）

1. 滑 Threads（用 app 內搜尋「撿到鳥」「路殺」等關鍵字）
2. 看到求助文 → 分享 → 複製連結
3. 開 GitHub（手機可用 app）→ `pipeline/inbox.md` → 編輯 → 貼連結，下一行貼內文 → commit
4. workflow 自動分類、寫進當日摘要、清空收件匣

## 設定

- 關鍵字：`keywords.json`（一輪掃描 = 關鍵字數量次查詢；quota 500/7天，內建 450 上限保護）
- Token 取得與 App Review：`docs/setup/threads-app-setup.md`

## 每日人工流程（3–5 分鐘）

1. 開當日 `digests/YYYY-MM-DD.md`
2. 照「人工檢查項目」清單：標缺口、抽查分類、值得回的手動回覆
3. 七天後對照 `docs/planning/00-next-steps.md` 的 go/no-go 門檻
