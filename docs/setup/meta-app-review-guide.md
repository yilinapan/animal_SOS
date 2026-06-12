# Meta App Review 申請指南（threads_keyword_search Advanced Access）

目標：取得 `threads_keyword_search` 的 Advanced Access，讓管線可以搜全站公開貼文。

**預計時程**：提交後 2–6 週審查；可能要求商家驗證（另加 1–2 週）；首次退件常見，補件後通常過。

---

## 事前準備（提交前要備齊）

### 1. 隱私政策頁（必要）

需要一個可公開瀏覽的網址。最快的方式是用 GitHub Pages：

1. 在 repo 根目錄建 `docs/legal/privacy.md`
2. 到 repo Settings → Pages → Source 選 `main` 分支 `/docs` 資料夾 → Save
3. 網址會是 `https://yilinapan.github.io/animal_SOS/legal/privacy`

隱私政策內容最少要包含：
- 你蒐集哪些資料（Threads 公開貼文內容）
- 如何使用（用於分類和產生回覆建議，不對外揭露個人資料）
- 如何聯絡你（email 即可）

### 2. 使用條款頁（必要）

同上，建 `docs/legal/terms.md`，網址 `https://yilinapan.github.io/animal_SOS/legal/terms`。

內容只需說明：這是一個台灣動物救援資訊服務，使用者可以透過 Threads 互動，回覆內容僅供資訊參考，緊急情況請撥打官方電話。

### 3. 螢幕錄影（必要）

Meta 要求示範 app 如何使用這個 permission。錄一段 1–3 分鐘影片：

- 開發模式下用 Graph API Explorer 或 Postman 呼叫 `/keyword_search?q=撿到鳥`
- 顯示回傳的貼文資料（tester 帳號自己發的測試貼文即可，不需要真實公開貼文）
- 說明：「App 用這個 API 搜尋台灣 Threads 上的動物求助貼文，後端 AI 分類後提供正確的救援資訊回覆」

錄影上傳到 Google Drive 或 YouTube（不公開），提交時貼連結。

---

## 提交步驟

### Step 1：開啟 App Review 申請

1. [developers.facebook.com](https://developers.facebook.com/apps) → 你的 app
2. 左側選單 → **App Review** → **Permissions and Features**
3. 找到 `threads_keyword_search` → 點 **Request Advanced Access**

### Step 2：填寫申請表

- **How will you use this permission?**（用途說明，英文）

  建議填：
  > Animal SOS is a Taiwan-based service that monitors Threads posts about animals in need (injured wildlife, roadkill, lost pets, stray animals). The app uses keyword_search to find relevant help-seeking posts in real time, classifies them by case type and urgency using AI, and provides users with accurate, authoritative information about local animal rescue resources and official hotlines. The goal is to fill the information gap where people posting on Threads don't receive timely, correct guidance.

- **Privacy Policy URL**：填上面 GitHub Pages 的網址
- **Terms of Service URL**：填上面 GitHub Pages 的網址
- **Video walkthrough URL**：貼錄影連結

### Step 3：Business Verification（可能要求）

提交後 Meta 可能要求商家驗證。有兩條路：

**路線 A — 個人身分驗證（Admin Verification）**
- 不需要公司行號
- 需要提供政府核發的身分證件（護照、身分證等）
- 在 Business Manager → Security Center → Verify your identity

**路線 B — 公司行號驗證**
- 需要統一編號、公司名稱、地址
- 有公司的話走這條更快

先試路線 A；Meta 要求路線 B 再說。

### Step 4：等待與補件

- 收到 Meta 通知後（email + Developer 後台）依指示補件
- 被退件時通常有具體原因，補件後重提即可
- 審查期間排程 keyword search 會繼續失敗（正常），手動收件匣照常運作

---

## 審查通過後

1. 更新 repo Variable：`THREADS_SEARCH_ENABLED` → 刪除（或改成 `true`）
2. 重新產生 access token（需重新 OAuth 授權，Advanced Access 才會反映在 token scope）
3. 更新 GitHub Secret `THREADS_ACCESS_TOKEN`
4. Run workflow 確認搜尋有回傳公開貼文

---

## 問題排解

| 現象 | 原因 | 解法 |
|---|---|---|
| code 10 錯誤 | 還是 Standard Access | 等審查通過後重新產生 token |
| 審查卡超過 6 週沒消息 | Meta 後台有時會停住 | 到 [Meta 開發者社群](https://developers.facebook.com/community) 回報，說明 App ID 和等待時間 |
| 被要求 Business Verification | 需要公司身分 | 先試 Admin Verification（個人身分證）|
