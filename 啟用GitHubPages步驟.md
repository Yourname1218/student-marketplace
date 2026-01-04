# 🔧 啟用 GitHub Pages 完整步驟

## ❌ 問題

所有部署都失敗，錯誤訊息：
```
Error: Get Pages site failed. Please verify that the repository has Pages enabled and configured to build using GitHub Actions
```

**原因：** GitHub Pages 還沒有啟用或設定錯誤。

---

## ✅ 解決步驟

### 步驟 1：啟用 GitHub Pages

1. **開啟瀏覽器**，前往你的 GitHub repository：
   ```
   https://github.com/Yourname1218/student-marketplace
   ```

2. **點擊上方的「Settings」標籤**

3. **左側選單往下滾動**，找到「**Pages**」（在「Code and automation」區塊）

4. **在「Build and deployment」區塊**：
   - **Source**：選擇「**GitHub Actions**」
   - 不要選擇「Deploy from a branch」

5. **不需要其他設定**，GitHub Pages 已經啟用

---

### 步驟 2：確認 Secret 已設定

1. 還在 Settings 頁面
2. 左側選單找到「**Secrets and variables**」
3. 點擊「**Actions**」
4. **確認是否有 `VITE_API_URL` Secret**
5. 如果沒有，點「**New repository secret**」：
   - **Name**: `VITE_API_URL`
   - **Secret**: `https://wa-bao-qu-campus.onrender.com`
   - 點「**Add secret**」

---

### 步驟 3：重新觸發部署

1. 點擊 repository 上方的「**Actions**」標籤
2. 左側會看到「**Deploy to GitHub Pages**」工作流程
3. 點擊「**Deploy to GitHub Pages**」
4. 點擊右側的「**Run workflow**」按鈕
5. 確認選擇「**main**」分支
6. 點擊綠色的「**Run workflow**」按鈕
7. 等待 2-3 分鐘

---

### 步驟 4：查看結果

1. 回到 **Settings → Pages**
2. 頁面頂部會顯示：
   ```
   Your site is live at https://Yourname1218.github.io/student-marketplace/
   ```
3. 或者到 **Actions** 標籤查看部署狀態
4. 如果看到綠色的勾勾 ✅，表示成功！

---

## 📋 檢查清單

部署前確認：
- [ ] GitHub Pages 已啟用（Settings → Pages）
- [ ] Source 設定為「GitHub Actions」（不是 branch）
- [ ] 已設定 `VITE_API_URL` Secret
- [ ] 已觸發 Actions 部署

---

## ⚠️ 常見錯誤

### 錯誤 1：選擇了「Deploy from a branch」

**解決方法：**
- 必須選擇「**GitHub Actions**」
- 不要選擇任何 branch

### 錯誤 2：Secret 未設定

**解決方法：**
- 確認有設定 `VITE_API_URL`
- 值應該是你的 Render 網址

---

## 🎉 完成後

成功後你會看到：
- ✅ Actions 顯示綠色勾勾
- ✅ Settings → Pages 顯示網站網址
- ✅ 可以訪問網站並正常使用

---

**按照這些步驟執行，應該就能成功部署了！** 🚀

