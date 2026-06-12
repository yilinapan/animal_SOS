# Threads App 設定指南（開發模式，免正式審核）

目標：拿到一組能用 `keyword_search` 的**長效 access token**，放進 GitHub Secrets。

你已完成：✅ 開好 Threads 帳號　✅ 帳號加為 tester

## 剩餘步驟

### 1. 確認 app 權限設定

到 [developers.facebook.com](https://developers.facebook.com/apps) → 你的 app → Use cases → **Access the Threads API** → Settings，勾選：

- `threads_basic`（必須）
- `threads_keyword_search`（關鍵字搜尋）

之後若要 API 發回覆再加：`threads_content_publish`、`threads_manage_replies`。

### 2. 確認 tester 已接受邀請

App Dashboard → App roles → Roles 看到你的 Threads 帳號；同時到 **Threads app 內** → 設定 → 帳號 → 網站權限 → 邀請，按接受。沒接受邀請的話下一步會失敗。

### 3. 取得 access token

最快的方式（不用寫程式）：

1. App Dashboard → Use cases → Access the Threads API → 找 **Threads API 測試工具 / Generate access token**（介面可能叫 Threads Tester）
2. 選你的帳號 → 授權 → 複製產生的 token

如果 dashboard 沒有產生器，走 OAuth 手動流程：

1. 在 app 設定裡把 Redirect URI 設成 `https://localhost/`
2. 瀏覽器開：
   ```
   https://threads.net/oauth/authorize?client_id=<APP_ID>&redirect_uri=https://localhost/&scope=threads_basic,threads_keyword_search&response_type=code
   ```
3. 授權後，從跳轉網址複製 `code=` 後面那串
4. 換短效 token（terminal 執行）：
   ```bash
   curl -X POST https://graph.threads.net/oauth/access_token \
     -d client_id=<APP_ID> -d client_secret=<APP_SECRET> \
     -d grant_type=authorization_code -d redirect_uri=https://localhost/ \
     -d code=<CODE>
   ```
5. 短效換長效（60 天）：
   ```bash
   curl "https://graph.threads.net/access_token?grant_type=th_exchange_token&client_secret=<APP_SECRET>&access_token=<短效TOKEN>"
   ```

### 4. 放進 GitHub Secrets

GitHub repo → Settings → Secrets and variables → Actions → New repository secret：

| Secret 名稱 | 內容 |
|---|---|
| `THREADS_ACCESS_TOKEN` | 上一步的長效 token |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) 申請的 API key |

### 5. 驗證

GitHub repo → Actions → `threads-monitor` → **Run workflow**（選這個分支）→ 跑完後看 `pipeline/digests/` 是否出現當日摘要。

## ⚠️ keyword_search 的權限分級（2026-06-12 實測確認）

開發模式（Standard Access）下 `keyword_search` **只能搜到 tester 自己帳號發的貼文**——
搜全站公開貼文需要 **Advanced Access**，必須通過 Meta App Review。
（這是 2026-06-12 第一次實跑 workflow 得到 code 10 錯誤的原因。）

App Review 需要準備：

1. **隱私政策網址**（必要）：可用 GitHub Pages 靜態頁
2. **使用條款網址**（必要）：同上
3. **螢幕錄影**：示範 app 如何使用 keyword_search（開發模式下對自己帳號的貼文操作即可示範）
4. **用途說明**：例「監測 Threads 上的動物救援求助貼文，自動分類後提供正確的官方通報資訊」
5. **商家驗證**：Meta「可能」要求（提交後才會明確通知）。沒有公司行號時可嘗試管理員身分驗證（Admin/Individual Verification），不行再說。

時程預期（社群經驗）：審查 2–6 週、商家驗證另加 1–2 週、第一次被退件很常見。

**審查通過前的替代方案**：手動收件匣 `pipeline/inbox.md`——滑 Threads 看到求助文，
把連結＋內文貼進去 commit，workflow 會自動分類進每日摘要。
可在 repo Settings → Variables 設 `THREADS_SEARCH_ENABLED=false` 停用注定失敗的搜尋。

## 注意事項

- **token 60 天到期**：到期前用 `https://graph.threads.net/v1.0/refresh_access_token?grant_type=th_refresh_token&access_token=<舊TOKEN>` 換新，再更新 Secret。
- **quota**：keyword search 每滾動 7 天 500 次。管線已內建保護（上限 450，超過自動跳過該輪）。
- **schedule 只在預設分支生效**：合併進預設分支前，排程不會自動跑，要手動 Run workflow。
