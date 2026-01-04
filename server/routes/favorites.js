import express from 'express'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// 取得我的收藏
router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.id
  const db = req.app.locals.db

  try {
    const favorites = db.prepare(`
      SELECT p.*, u.username as seller_name, u.school as seller_school, u.phone as seller_phone
      FROM favorites f
      JOIN products p ON f.product_id = p.id
      JOIN users u ON p.seller_id = u.id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `).all(userId)

    res.json(favorites)
  } catch (error) {
    console.error('取得收藏錯誤:', error)
    res.status(500).json({ message: '取得收藏失敗' })
  }
})

// 新增收藏
router.post('/', authenticateToken, (req, res) => {
  const { productId } = req.body
  const userId = req.user.id
  const db = req.app.locals.db

  try {
    // 檢查商品是否存在
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId)
    if (!product) {
      return res.status(404).json({ message: '商品不存在' })
    }

    // 檢查是否已收藏
    const existing = db.prepare('SELECT * FROM favorites WHERE user_id = ? AND product_id = ?').get(userId, productId)
    if (existing) {
      return res.status(400).json({ message: '已經收藏過此商品' })
    }

    db.prepare('INSERT INTO favorites (user_id, product_id) VALUES (?, ?)').run(userId, productId)

    res.status(201).json({ message: '已加入收藏' })
  } catch (error) {
    console.error('新增收藏錯誤:', error)
    res.status(500).json({ message: '新增收藏失敗' })
  }
})

// 移除收藏
router.delete('/:productId', authenticateToken, (req, res) => {
  const { productId } = req.params
  const userId = req.user.id
  const db = req.app.locals.db

  try {
    const result = db.prepare('DELETE FROM favorites WHERE user_id = ? AND product_id = ?').run(userId, productId)

    if (result.changes === 0) {
      return res.status(404).json({ message: '收藏不存在' })
    }

    res.json({ message: '已移除收藏' })
  } catch (error) {
    console.error('移除收藏錯誤:', error)
    res.status(500).json({ message: '移除收藏失敗' })
  }
})

export default router

