import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import commentRoutes from './routes/comments.js'
import favoriteRoutes from './routes/favorites.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// 中間件
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://Yourname1218.github.io',,
        'http://localhost:3000'
      ]
    : '*',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 初始化資料庫
const db = new Database(join(__dirname, 'database.db'))
db.pragma('journal_mode = WAL')

// 建立資料表
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    school TEXT,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seller_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    category TEXT NOT NULL,
    condition TEXT NOT NULL,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );
`)

// 將資料庫實例掛載到 app
app.locals.db = db

// 路由
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/products', commentRoutes)
app.use('/api/favorites', favoriteRoutes)

// 初始化資料庫端點（僅用於首次部署）
app.get('/api/init-db', async (req, res) => {
  try {
    // 檢查是否已有資料
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get()
    
    if (userCount.count > 0) {
      return res.json({ 
        message: '資料庫已經初始化過了',
        userCount: userCount.count,
        note: '如果需重新初始化，請刪除資料庫檔案'
      })
    }

    // 導入並執行 seed 腳本
    const bcrypt = (await import('bcryptjs')).default
    const hashedPassword = await bcrypt.hash('123456', 10)
    
    // 建立測試使用者
    const users = [
      { username: '小明', email: 'xiaoming@student.edu.tw', school: '台灣大學', phone: '0912345678' },
      { username: '小華', email: 'xiaohua@student.edu.tw', school: '清華大學', phone: '0923456789' },
      { username: '小美', email: 'xiaomei@student.edu.tw', school: '交通大學', phone: '0934567890' },
      { username: '小傑', email: 'xiaojie@student.edu.tw', school: '成功大學', phone: '0945678901' },
      { username: '小玲', email: 'xiaoling@student.edu.tw', school: '政治大學', phone: '0956789012' },
      { username: '大雄', email: 'daxiong@student.edu.tw', school: '中央大學', phone: '0967890123' },
      { username: '靜香', email: 'jingxiang@student.edu.tw', school: '中興大學', phone: '0978901234' }
    ]

    const userIds = []
    for (const user of users) {
      const result = db.prepare(
        'INSERT INTO users (username, email, password, school, phone) VALUES (?, ?, ?, ?, ?)'
      ).run(user.username, user.email, hashedPassword, user.school, user.phone)
      userIds.push(result.lastInsertRowid)
    }

    // 建立範例商品
    const products = [
      { title: '微積分課本（第三版）', description: '台大微積分課本，幾乎全新，只有前幾章有畫重點。非常適合理工科系學生使用，內容完整詳細，附習題解答。', price: 350, category: '教科書', condition: '九成新' },
      { title: '普通化學教科書', description: '大一普化指定用書，保存良好，沒有破損。包含完整章節和實驗說明，適合理學院和醫學院學生。', price: 400, category: '教科書', condition: '八成新' },
      { title: '經濟學原理（上下冊）', description: '商學院必修課本，兩本一起賣。內容淺顯易懂，適合初學者。有少許筆記但不影響閱讀。', price: 600, category: '教科書', condition: '八成新' },
      { title: '英文文法大全', description: '準備托福、雅思必備！內容詳盡，例句豐富。幾乎沒用過，九成五新。', price: 280, category: '教科書', condition: '九成新' },
      { title: '計算機概論（最新版）', description: '資工系必備教材，涵蓋演算法、資料結構等重要章節。有精美筆記和重點整理。', price: 450, category: '教科書', condition: '九成新' },
      { title: '統計學（含習題解答）', description: '商學院、社科院必修，附完整習題解答本。書況極佳，僅翻閱數次。', price: 380, category: '教科書', condition: '九成新' },
      { title: '有機化學（第五版）', description: '化學系、生科系必備，內容豐富完整。有詳細的反應機制圖解和練習題。', price: 500, category: '教科書', condition: '八成新' },
      { title: '管理學（第三版）', description: '企管系指定教材，理論與實務兼具。書況良好，無缺頁。適合準備考試使用。', price: 320, category: '教科書', condition: '八成新' },
      { title: '物理學（上冊）', description: '大一物理課本，內容包含力學、熱學等。有少量筆記，整體狀況良好。', price: 360, category: '教科書', condition: '八成新' },
      { title: '日語五十音+基礎文法', description: '日文入門必備！圖文並茂，附CD光碟。全新未使用，非常適合初學者。', price: 250, category: '教科書', condition: '全新' },
      { title: 'AirPods Pro 二代', description: '使用僅三個月，功能完全正常。盒裝配件齊全，還在保固期內。音質清晰，降噪效果極佳。', price: 5800, category: '3C產品', condition: '九成新' },
      { title: 'iPad Air 第五代 64GB', description: '淡藍色，狀況極佳，螢幕無刮痕。附原廠充電器和Apple Pencil 2代。適合上課筆記和追劇。', price: 15000, category: '3C產品', condition: '九成新' },
      { title: '羅技 MX Master 3 無線滑鼠', description: '人體工學設計，用起來非常舒適。適合長時間使用，支援多裝置切換。功能完全正常。', price: 2200, category: '3C產品', condition: '八成新' },
      { title: 'Switch OLED 主機（白色）', description: '買來玩薩爾達和健身環，現在畢業要賣。附三款熱門遊戲卡帶，保護殼和螢幕保護貼。', price: 9500, category: '3C產品', condition: '九成新' },
      { title: 'Kindle Paperwhite 電子書閱讀器', description: '8GB容量，防水設計。螢幕不傷眼，超級適合看小說和論文。充一次電可用數週。', price: 3200, category: '3C產品', condition: '九成新' },
      { title: '小米行動電源 20000mAh', description: '大容量，可充手機4-5次。雙向快充，支援多種裝置。外出必備，幾乎全新。', price: 600, category: '3C產品', condition: '九成新' },
      { title: '機械式鍵盤 Cherry 青軸', description: '打字手感極佳，RGB背光超炫。適合寫程式和打報告。功能完全正常，鍵帽無磨損。', price: 1800, category: '3C產品', condition: '八成新' },
      { title: 'Apple Watch SE 40mm', description: '粉色錶帶，功能完整。可監測運動、心率和睡眠。附充電器和額外錶帶兩條。', price: 6500, category: '3C產品', condition: '九成新' },
      { title: 'Sony WH-1000XM4 降噪耳機', description: '業界最強降噪！音質一流，續航力超強。附原廠收納盒和所有配件。圖書館必備神器。', price: 7200, category: '3C產品', condition: '九成新' },
      { title: '藍牙喇叭 JBL Flip 5', description: '防水設計，音質清晰有力。適合宿舍、露營使用。電池續航12小時以上。', price: 1800, category: '3C產品', condition: '八成新' },
      { title: 'iPad 保護殼 + 鍵盤組', description: '適用iPad Air/Pro，可拆卸藍牙鍵盤。打字超方便，像筆電一樣。幾乎全新，只用過幾次。', price: 800, category: '文具用品', condition: '九成新' },
      { title: 'LAMY 鋼筆禮盒組', description: '經典款式，書寫流暢。附墨水和筆套，送禮自用兩相宜。九成新，外觀無刮痕。', price: 1200, category: '文具用品', condition: '九成新' },
      { title: '無印良品文具組合', description: '包含筆記本5本、原子筆10支、螢光筆6支。全新未拆封，適合開學準備。', price: 500, category: '文具用品', condition: '全新' },
      { title: 'Moleskine 筆記本（大）', description: '經典黑色硬殼，質感一流。適合寫日記、做筆記。只用了前10頁，其餘全新。', price: 350, category: '文具用品', condition: '九成新' },
      { title: '三菱uni自動鉛筆套組', description: '0.5mm，5支不同顏色。書寫順暢不斷芯，附贈筆芯一盒。學生必備！', price: 280, category: '文具用品', condition: '九成新' },
      { title: 'A4資料夾整理箱', description: '透明抽屜式，可放20個資料夾。整理報告和講義超方便。狀況良好，無破損。', price: 400, category: '文具用品', condition: '八成新' },
      { title: '計算機CASIO FX-82', description: '工程用計算機，理工科必備。功能完整，按鍵靈敏。附使用說明書和保護殼。', price: 450, category: '文具用品', condition: '九成新' },
      { title: '便利貼組合包（12色）', description: '各種尺寸和顏色，做筆記超方便。全新未拆封，一次買齊所有顏色！', price: 150, category: '文具用品', condition: '全新' },
      { title: '多功能筆筒收納盒', description: '木質質感，多格設計。可放筆、剪刀、迴紋針等。讓桌面整齊有序。', price: 200, category: '文具用品', condition: '九成新' },
      { title: '雙肩後背包（筆電專用）', description: '防水材質，可放15吋筆電。多夾層設計，超大容量。適合通勤上課使用。', price: 900, category: '文具用品', condition: '八成新' },
      { title: '小米空氣清淨機3', description: '除PM2.5效果超好！適合小套房使用。運轉安靜，附全新濾網一片。', price: 2800, category: '生活用品', condition: '九成新' },
      { title: 'Dyson吹風機（粉色）', description: '快乾不傷髮質，負離子技術。附所有配件和收納架。功能完全正常。', price: 8500, category: '生活用品', condition: '九成新' },
      { title: '電熱水壺（不鏽鋼）', description: '1.8L大容量，快速煮沸。自動斷電安全設計。宿舍神器，泡麵、咖啡都方便。', price: 400, category: '生活用品', condition: '八成新' },
      { title: '書桌檯燈LED護眼', description: '可調光、調色溫。長時間看書不累眼。USB充電，可夾式設計，不佔空間。', price: 600, category: '生活用品', condition: '九成新' },
      { title: 'IKEA 收納櫃（三層）', description: '白色簡約風格，堅固耐用。適合放衣物、書籍。需自取，狀況良好。', price: 800, category: '生活用品', condition: '八成新' },
      { title: '除濕機小型（500ml）', description: '宿舍必備！靜音運轉，自動斷電。梅雨季節超好用，防止衣物發霉。', price: 900, category: '生活用品', condition: '九成新' },
      { title: '懶人沙發（米色）', description: '超舒適！看書、追劇必備。可拆洗外套，填充飽滿。需自取。', price: 1200, category: '生活用品', condition: '八成新' },
      { title: '保溫杯 象印 600ml', description: '保溫效果超強！早上裝熱水，晚上還是熱的。不鏽鋼材質，不會有異味。', price: 800, category: '生活用品', condition: '九成新' },
      { title: '電風扇立扇（遙控）', description: 'DC直流馬達，省電又安靜。12段風速，定時功能。夏天必備！', price: 1500, category: '生活用品', condition: '九成新' },
      { title: '衣架組合包（50支）', description: '防滑設計，不會掉衣服。適合各種衣物。全新未拆封，買太多用不完。', price: 200, category: '生活用品', condition: '全新' },
      { title: '瑜珈墊（厚10mm）', description: 'NBR材質，加厚設計超舒適。附背帶和收納袋。居家運動、瑜珈都適合。', price: 500, category: '運動器材', condition: '九成新' },
      { title: 'Nike 慢跑鞋 US 9', description: '氣墊設計，穿起來很舒服。只穿過5次，鞋況極佳。原價3200，便宜出清。', price: 1800, category: '運動器材', condition: '九成新' },
      { title: '健身彈力帶組（5條）', description: '不同阻力等級，適合各種訓練。居家健身超方便，不佔空間。附教學影片連結。', price: 350, category: '運動器材', condition: '全新' },
      { title: '啞鈴組 5kg x2', description: '可調式設計，重量可調整。適合居家訓練。橡膠包覆，不會刮傷地板。', price: 800, category: '運動器材', condition: '八成新' },
      { title: 'adidas 運動背包', description: '大容量，可放運動鞋、衣物、水壺。防水材質，外觀時尚。幾乎全新。', price: 900, category: '運動器材', condition: '九成新' },
      { title: '跳繩（專業級）', description: '可調長度，軸承設計超順暢。計數功能，記錄運動量。有氧運動必備！', price: 250, category: '運動器材', condition: '九成新' },
      { title: '瑜珈磚 + 瑜珈伸展帶', description: '輔助伸展和各種瑜珈動作。EVA材質，輕量耐用。全新未使用。', price: 300, category: '運動器材', condition: '全新' },
      { title: '運動水壺（1L）', description: '大容量，附時間刻度提醒喝水。防漏設計，可放冰塊。運動必備！', price: 350, category: '運動器材', condition: '九成新' },
      { title: 'Under Armour 壓縮褲', description: 'M號，彈性極佳，排汗快乾。跑步、健身都適合。只穿過2次，九成五新。', price: 800, category: '運動器材', condition: '九成新' },
      { title: '飛輪健身車', description: '靜音設計，不怕吵到室友。可調阻力，附電子螢幕顯示。需自取。', price: 3500, category: '運動器材', condition: '八成新' },
      { title: '迪士尼門票（買一送一券）', description: '有效期限到年底，可以帶朋友一起去玩。原價1200，現在優惠出售。', price: 800, category: '其他', condition: '全新' },
      { title: 'Switch遊戲 薩爾達傳說', description: '曠野之息，超好玩！已破關想換其他遊戲。卡帶無刮痕，附盒裝。', price: 1400, category: '其他', condition: '九成新' },
      { title: '星巴克隨行卡（餘額500）', description: '卡片精美，儲值500元。可送禮可自用，買咖啡很方便。', price: 450, category: '其他', condition: '全新' },
      { title: '多肉植物組合（5盆）', description: '好照顧的多肉植物，美化宿舍超適合。附可愛小盆栽，綠意盎然。', price: 300, category: '其他', condition: '全新' },
      { title: 'Lego積木 哈利波特霍格華茲', description: '完整未拆封，收藏品。包含所有零件和說明書。喜歡樂高的不要錯過！', price: 3500, category: '其他', condition: '全新' },
      { title: '電影票券組（威秀）', description: '4張電影票，不限場次時段。有效期限3個月。約會、聚會都適合。', price: 800, category: '其他', condition: '全新' },
      { title: '香氛蠟燭禮盒（Jo Malone）', description: '經典英國梨與小蒼蘭香味。禮盒包裝精美，送禮大方。全新未拆封。', price: 1800, category: '其他', condition: '全新' },
      { title: '寶可夢卡牌收藏冊', description: '稀有卡牌20張，含閃卡。適合收藏或和朋友對戰。狀況良好，無折損。', price: 1500, category: '其他', condition: '九成新' },
      { title: '拍立得相機 Mini 11', description: '薰衣草紫色，超可愛！功能正常，附底片10張。記錄大學生活的好幫手。', price: 1800, category: '其他', condition: '九成新' },
      { title: '桌遊：狼人殺豪華版', description: '適合8-18人，派對必備！中文版，規則簡單容易上手。盒裝完整，配件齊全。', price: 600, category: '其他', condition: '九成新' }
    ]

    let productCount = 0
    for (let i = 0; i < products.length; i++) {
      const p = products[i]
      const sellerId = userIds[i % userIds.length]
      db.prepare('INSERT INTO products (seller_id, title, description, price, category, condition, image) VALUES (?, ?, ?, ?, ?, ?, ?)').run(sellerId, p.title, p.description, p.price, p.category, p.condition, null)
      productCount++
    }

    res.json({ 
      message: '資料庫初始化成功！',
      usersCreated: users.length,
      productsCreated: productCount,
      testAccount: 'xiaoming@student.edu.tw / 123456'
    })
  } catch (error) {
    console.error('初始化錯誤:', error)
    res.status(500).json({ 
      message: '初始化失敗',
      error: error.message 
    })
  }
})

// 首頁
app.get('/api', (req, res) => {
  res.json({ message: '學生二手交易平台 API' })
})

// 錯誤處理
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: '伺服器錯誤' })
})

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`伺服器運行在 http://localhost:${PORT}`)
})

// 優雅關閉
process.on('SIGINT', () => {
  db.close()
  process.exit(0)
})

