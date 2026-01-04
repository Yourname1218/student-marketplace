import express from 'express'
import bcrypt from 'bcryptjs'
import { authenticateToken, generateToken } from '../middleware/auth.js'

const router = express.Router()

// 註冊
router.post('/register', async (req, res) => {
  const { username, email, password, school, phone } = req.body
  const db = req.app.locals.db

  try {
    // 檢查使用者是否已存在
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ? OR username = ?').get(email, username)
    
    if (existingUser) {
      return res.status(400).json({ message: '使用者名稱或電子郵件已被使用' })
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10)

    // 建立使用者
    const result = db.prepare(
      'INSERT INTO users (username, email, password, school, phone) VALUES (?, ?, ?, ?, ?)'
    ).run(username, email, hashedPassword, school || null, phone || null)

    const user = db.prepare('SELECT id, username, email, school, phone FROM users WHERE id = ?').get(result.lastInsertRowid)

    // 產生 token
    const token = generateToken(user)

    res.status(201).json({ user, token })
  } catch (error) {
    console.error('註冊錯誤:', error)
    res.status(500).json({ message: '註冊失敗' })
  }
})

// 登入
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const db = req.app.locals.db

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)

    if (!user) {
      return res.status(401).json({ message: '電子郵件或密碼錯誤' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: '電子郵件或密碼錯誤' })
    }

    const { password: _, ...userWithoutPassword } = user
    const token = generateToken(userWithoutPassword)

    res.json({ user: userWithoutPassword, token })
  } catch (error) {
    console.error('登入錯誤:', error)
    res.status(500).json({ message: '登入失敗' })
  }
})

// 更新個人資料
router.put('/profile', authenticateToken, async (req, res) => {
  const { username, email, school, phone } = req.body
  const userId = req.user.id
  const db = req.app.locals.db

  try {
    // 檢查使用者名稱或電子郵件是否被其他人使用
    const existingUser = db.prepare(
      'SELECT * FROM users WHERE (email = ? OR username = ?) AND id != ?'
    ).get(email, username, userId)

    if (existingUser) {
      return res.status(400).json({ message: '使用者名稱或電子郵件已被使用' })
    }

    db.prepare(
      'UPDATE users SET username = ?, email = ?, school = ?, phone = ? WHERE id = ?'
    ).run(username, email, school || null, phone || null, userId)

    const updatedUser = db.prepare('SELECT id, username, email, school, phone FROM users WHERE id = ?').get(userId)

    res.json({ user: updatedUser })
  } catch (error) {
    console.error('更新個人資料錯誤:', error)
    res.status(500).json({ message: '更新失敗' })
  }
})

// 修改密碼
router.put('/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const userId = req.user.id
  const db = req.app.locals.db

  try {
    const user = db.prepare('SELECT password FROM users WHERE id = ?').get(userId)

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: '目前密碼錯誤' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, userId)

    res.json({ message: '密碼更新成功' })
  } catch (error) {
    console.error('修改密碼錯誤:', error)
    res.status(500).json({ message: '密碼更新失敗' })
  }
})

export default router

