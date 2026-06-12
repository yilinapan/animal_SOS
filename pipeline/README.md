# Animal SOS 監測管線

驗證期工具：自動掃 Threads 求助貼文 → AI 分類 → 每日摘要。對應 `docs/planning/00-next-steps.md` 的 P0 需求驗證。

```
搜尋（keyword_search, RECENT）
  → 去重（data/seen.json）＋ 只留 24h 內、非轉發
  → Claude Haiku 分類（求助文？案型？地區？緊急度？）
  → data/posts/YYYY-MM-DD.json
  → digests/YYYY-MM-DD.md（人工每日只看這份）
```

## 使用

- 自動：`.github/workflows/monitor.yml`（09:00 / 17:00 台北時間；合併進預設分支前需手動 Run workflow）
- 本機：
  ```bash
  cd pipeline && npm install
  THREADS_ACCESS_TOKEN=... ANTHROPIC_API_KEY=... npm run monitor
  ```

## 設定

- 關鍵字：`keywords.json`（一輪掃描 = 關鍵字數量次查詢；quota 500/7天，內建 450 上限保護）
- Token 取得：`docs/setup/threads-app-setup.md`

## 每日人工流程（3–5 分鐘）

1. 開當日 `digests/YYYY-MM-DD.md`
2. 照「人工檢查項目」清單：標缺口、抽查分類、值得回的手動回覆
3. 七天後對照 `docs/planning/00-next-steps.md` 的 go/no-go 門檻

## 尚未驗證

此骨架尚未用真實 token 跑過（等 Secrets 設定）。第一次執行如遇 API 欄位/權限錯誤，調整 `src/threads.ts` 的 fields 參數即可。
