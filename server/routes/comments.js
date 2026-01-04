import express from 'express'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// 取得商品留言
router.get('/:productId/comments', (req, res) => {
  const { productId } = req.params
  const db = req.app.locals.db

  try {
    const comments = db.prepare(`
      SELECT c.*, u.username
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.product_id = ?
      ORDER BY c.created_at DESC
    `).all(productId)

    res.json(comments)
  } catch (error) {
    console.error('取得留言錯誤:', error)
    res.status(500).json({ message: '取得留言失敗' })
  }
})

// 新增留言
router.post('/:productId/comments', authenticateToken, (req, res) => {
  const { productId } = req.params
  const { content } = req.body
  const userId = req.user.id
  const db = req.app.locals.db

  try {
    // 確認商品存在
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId)
    if (!product) {
      return res.status(404).json({ message: '商品不存在' })
    }

    const result = db.prepare(
      'INSERT INTO comments (product_id, user_id, content) VALUES (?, ?, ?)'
    ).run(productId, userId, content)

    const comment = db.prepare(`
      SELECT c.*, u.username
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `).get(result.lastInsertRowid)

    res.status(201).json(comment)
  } catch (error) {
    console.error('新增留言錯誤:', error)
    res.status(500).json({ message: '新增留言失敗' })
  }
})

export default router

