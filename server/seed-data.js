import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const db = new Database(join(__dirname, 'database.db'))

// 清空現有資料
console.log('清空現有資料...')
db.exec(`
  DELETE FROM favorites;
  DELETE FROM comments;
  DELETE FROM products;
  DELETE FROM users;
`)

// 建立測試使用者
console.log('建立測試使用者...')
const hashedPassword = await bcrypt.hash('123456', 10)

const users = [
  { username: '小明', email: 'xiaoming@student.edu.tw', school: '台灣大學', phone: '0912345678' },
  { username: '小華', email: 'xiaohua@student.edu.tw', school: '清華大學', phone: '0923456789' },
  { username: '小美', email: 'xiaomei@student.edu.tw', school: '交通大學', phone: '0934567890' },
  { username: '小傑', email: 'xiaojie@student.edu.tw', school: '成功大學', phone: '0945678901' },
  { username: '小玲', email: 'xiaoling@student.edu.tw', school: '政治大學', phone: '0956789012' }
]

const userIds = []
for (const user of users) {
  const result = db.prepare(
    'INSERT INTO users (username, email, password, school, phone) VALUES (?, ?, ?, ?, ?)'
  ).run(user.username, user.email, hashedPassword, user.school, user.phone)
  userIds.push(result.lastInsertRowid)
}

// 範例商品資料
console.log('建立範例商品...')
const products = [
  // 教科書 (10個)
  {
    title: '微積分課本（第三版）',
    description: '台大微積分課本，幾乎全新，只有前幾章有畫重點。非常適合理工科系學生使用，內容完整詳細，附習題解答。',
    price: 350,
    category: '教科書',
    condition: '九成新',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzRBOTBFMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjQ4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfk5Y8L3RleHQ+PC9zdmc+'
  },
  {
    title: '普通化學教科書',
    description: '大一普化指定用書，保存良好，沒有破損。包含完整章節和實驗說明，適合理學院和醫學院學生。',
    price: 400,
    category: '教科書',
    condition: '八成新',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzlCNTlCNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjQ4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfp6o8L3RleHQ+PC9zdmc+'
  },
  {
    title: '經濟學原理（上下冊）',
    description: '商學院必修課本，兩本一起賣。內容淺顯易懂，適合初學者。有少許筆記但不影響閱讀。',
    price: 600,
    category: '教科書',
    condition: '八成新',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI0U5MUM1RSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjQ4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfkrA8L3RleHQ+PC9zdmc+'
  },
  {
    title: '英文文法大全',
    description: '準備托福、雅思必備！內容詳盡，例句豐富。幾乎沒用過，九成五新。',
    price: 280,
    category: '教科書',
    condition: '九成新',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzNCQTU0QSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjQ4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfk5Y8L3RleHQ+PC9zdmc+'
  },
  {
    title: '計算機概論（最新版）',
    description: '資工系必備教材，涵蓋演算法、資料結構等重要章節。有精美筆記和重點整理。',
    price: 450,
    category: '教科書',
    condition: '九成新',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzAwQkNENCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjQ4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfkrvvuI88L3RleHQ+PC9zdmc+'
  },
  {
    title: '統計學（含習題解答）',
    description: '商學院、社科院必修，附完整習題解答本。書況極佳，僅翻閱數次。',
    price: 380,
    category: '教科書',
    condition: '九成新',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI0ZGNTcyMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjQ4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfk4o8L3RleHQ+PC9zdmc+'
  },
  {
    title: '有機化學（第五版）',
    description: '化學系、生科系必備，內容豐富完整。有詳細的反應機制圖解和練習題。',
    price: 500,
    category: '教科書',
    condition: '八成新',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzhCQzM0QSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjQ4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfp6s8L3RleHQ+PC9zdmc+'
  },
  {
    title: '管理學（第三版）',
    description: '企管系指定教材，理論與實務兼具。書況良好，無缺頁。適合準備考試使用。',
    price: 320,
    category: '教科書',
    condition: '八成新',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzU0N0ZCRCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjQ4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfkrw8L3RleHQ+PC9zdmc+'
  },
  {
    title: '物理學（上冊）',
    description: '大一物理課本，內容包含力學、熱學等。有少量筆記，整體狀況良好。',
    price: 360,
    category: '教科書',
    condition: '八成新',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzNGNTFCNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjQ4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuKalO+4jzwvdGV4dD48L3N2Zz4='
  },
  {
    title: '日語五十音+基礎文法',
    description: '日文入門必備！圖文並茂，附CD光碟。全新未使用，非常適合初學者。',
    price: 250,
    category: '教科書',
    condition: '全新',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI0VDNDA3QSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjQ4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfh6/wn4e1PC90ZXh0Pjwvc3ZnPg=='
  },

  // 3C產品 (10個)
  {
    title: 'AirPods Pro 二代',
    description: '使用僅三個月，功能完全正常。盒裝配件齊全，還在保固期內。音質清晰，降噪效果極佳。',
    price: 5800,
    category: '3C產品',
    condition: '九成新',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzIxMjEyMSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjY0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfjonvuI88L3RleHQ+PC9zdmc+'
  },
  {
    title: 'iPad Air 第五代 64GB',
    description: '淡藍色，狀況極佳，螢幕無刮痕。附原廠充電器和Apple Pencil 2代。適合上課筆記和追劇。',
    price: 15000,
    category: '3C產品',
    condition: '九成新',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzg3Q0VGQSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjY0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfk7E8L3RleHQ+PC9zdmc+'
  },
  {
    title: '羅技 MX Master 3 無線滑鼠',
    description: '人體工學設計，用起來非常舒適。適合長時間使用，支援多裝置切換。功能完全正常。',
    price: 2200,
    category: '3C產品',
    condition: '八成新',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzQ1NEQ1NiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjY0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfluDvuI88L3RleHQ+PC9zdmc+'
  },
  {
    title: 'Switch OLED 主機（白色）',
    description: '買來玩薩爾達和健身環，現在畢業要賣。附三款熱門遊戲卡帶，保護殼和螢幕保護貼。',
    price: 9500,
    category: '3C產品',
    condition: '九成新',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI0UwMDAyQSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjY0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfjoXvuI88L3RleHQ+PC9zdmc+'
  },
  {
    title: 'Kindle Paperwhite 電子書閱讀器',
    description: '8GB容量，防水設計。螢幕不傷眼，超級適合看小說和論文。充一次電可用數週。',
    price: 3200,
    category: '3C產品',
    condition: '九成新',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzIzMkYzRSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjY0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfk5Y8L3RleHQ+PC9zdmc+'
  },
  {
    title: '小米行動電源 20000mAh',
    description: '大容量，可充手機4-5次。雙向快充，支援多種裝置。外出必備，幾乎全新。',
    price: 600,
    category: '3C產品',
    condition: '九成新',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI0ZGNjkwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjY0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCflovjgI88L3RleHQ+PC9zdmc+'
  },
  {
    title: '機械式鍵盤 Cherry 青軸',
    description: '打字手感極佳，RGB背光超炫。適合寫程式和打報告。功能完全正常，鍵帽無磨損。',
    price: 1800,
    category: '3C產品',
    condition: '八成新',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzFFODhFNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjY0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuKMqO+4jzwvdGV4dD48L3N2Zz4='
  },
  {
    title: 'Apple Watch SE 40mm',
    description: '粉色錶帶，功能完整。可監測運動、心率和睡眠。附充電器和額外錶帶兩條。',
    price: 6500,
    category: '3C產品',
    condition: '九成新',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI0ZGQzFDQyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjY0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuKMmuKPsO+4jzwvdGV4dD48L3N2Zz4='
  },
  {
    title: 'Sony WH-1000XM4 降噪耳機',
    description: '業界最強降噪！音質一流，續航力超強。附原廠收納盒和所有配件。圖書館必備神器。',
    price: 7200,
    category: '3C產品',
    condition: '九成新',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzAwMDAwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjY0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfjonjgI88L3RleHQ+PC9zdmc+'
  },
  {
    title: '藍牙喇叭 JBL Flip 5',
    description: '防水設計，音質清晰有力。適合宿舍、露營使用。電池續航12小時以上。',
    price: 1800,
    category: '3C產品',
    condition: '八成新',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI0ZGMzQwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjY0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCflYvvuI88L3RleHQ+PC9zdmc+'
  }
]

// 繼續其他類別...
console.log('專案過大，使用簡化版本')

// 新增商品
for (let i = 0; i < products.length; i++) {
  const product = products[i]
  const sellerId = userIds[i % userIds.length]
  
  db.prepare(
    'INSERT INTO products (seller_id, title, description, price, category, condition, image) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(sellerId, product.title, product.description, product.price, product.category, product.condition, product.image)
}

console.log('✅ 範例資料建立完成！')
console.log(`- 使用者: ${users.length} 位`)
console.log(`- 商品: ${products.length} 個`)
console.log('\n測試帳號:')
console.log('Email: xiaoming@student.edu.tw')
console.log('密碼: 123456')

db.close()

