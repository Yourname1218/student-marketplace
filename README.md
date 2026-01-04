# 學生二手交易平台

這是一個專為學生設計的二手交易平台，讓學生可以輕鬆地買賣二手商品。

## 功能特色

- ✅ 會員系統（註冊、登入、個人資料管理）
- ✅ 商品管理（刊登、編輯、刪除商品）
- ✅ 商品瀏覽與搜尋
- ✅ 分類與條件篩選
- ✅ 商品詳情與賣家資訊
- ✅ 留言功能（買賣雙方溝通）
- ✅ 收藏功能
- ✅ 個人中心
- ✅ 響應式設計（支援手機、平板、桌面）

## 技術架構

### 前端
- React 18
- Vite
- React Router
- Tailwind CSS
- Zustand（狀態管理）
- Axios

### 後端
- Node.js
- Express
- SQLite（better-sqlite3）
- JWT（身份驗證）
- bcryptjs（密碼加密）

## 安裝與執行

### 1. 安裝依賴

```bash
# 安裝所有依賴（根目錄、前端、後端）
npm run install:all
```

### 2. 啟動開發伺服器

```bash
# 同時啟動前端和後端
npm run dev
```

或分別啟動：

```bash
# 僅啟動前端 (http://localhost:3000)
npm run dev:client

# 僅啟動後端 (http://localhost:5000)
npm run dev:server
```

### 3. 開啟瀏覽器

前往 http://localhost:3000 即可使用平台。

## 商品分類

- 教科書
- 3C產品
- 文具用品
- 生活用品
- 運動器材
- 其他

## 商品狀況

- 全新
- 九成新
- 八成新
- 七成新以下

## 專案結構

```
├── client/                 # 前端
│   ├── src/
│   │   ├── api/           # API 請求
│   │   ├── components/    # 共用元件
│   │   ├── pages/         # 頁面元件
│   │   ├── store/         # 狀態管理
│   │   ├── App.jsx        # 主應用程式
│   │   └── main.jsx       # 進入點
│   └── package.json
├── server/                # 後端
│   ├── middleware/        # 中間件
│   ├── routes/            # 路由
│   ├── server.js          # 主伺服器
│   └── package.json
├── package.json           # 根 package.json
└── README.md
```

## API 端點

### 會員
- `POST /api/auth/register` - 註冊
- `POST /api/auth/login` - 登入
- `PUT /api/auth/profile` - 更新個人資料
- `PUT /api/auth/change-password` - 修改密碼

### 商品
- `GET /api/products` - 取得所有商品
- `GET /api/products/search` - 搜尋商品
- `GET /api/products/my-products` - 取得我的商品
- `GET /api/products/:id` - 取得單一商品
- `POST /api/products` - 建立商品
- `PUT /api/products/:id` - 更新商品
- `DELETE /api/products/:id` - 刪除商品

### 留言
- `GET /api/products/:productId/comments` - 取得商品留言
- `POST /api/products/:productId/comments` - 新增留言

### 收藏
- `GET /api/favorites` - 取得我的收藏
- `POST /api/favorites` - 新增收藏
- `DELETE /api/favorites/:productId` - 移除收藏

## 開發說明

- 圖片使用 Base64 編碼儲存（限制 5MB）
- JWT Token 有效期為 7 天
- 使用 SQLite 資料庫，資料儲存在 `server/database.db`
- 密碼使用 bcryptjs 加密

## 注意事項

- 請勿在生產環境使用預設的 JWT_SECRET
- 建議在生產環境使用雲端圖片儲存服務（如 AWS S3、Cloudinary）
- 建議升級到更強大的資料庫（如 PostgreSQL、MySQL）

## 授權

MIT License

