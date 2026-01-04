import express from 'express'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// 取得所有商品
router.get('/', (req, res) => {
  const { category, condition } = req.query
  const db = req.app.locals.db

  try {
    let query = `
      SELECT p.*, u.username as seller_name, u.school as seller_school, u.phone as seller_phone
      FROM products p
      JOIN users u ON p.seller_id = u.id
      WHERE 1=1
    `
    const params = []

    if (category) {
      query += ' AND p.category = ?'
      params.push(category)
    }

    if (condition) {
      query += ' AND p.condition = ?'
      params.push(condition)
    }

    query += ' ORDER BY p.created_at DESC'

    const products = db.prepare(query).all(...params)
    res.json(products)
  } catch (error) {
    console.error('取得商品錯誤:', error)
    res.status(500).json({ message: '取得商品失敗' })
  }
})

// 搜尋商品
router.get('/search', (req, res) => {
  const { q } = req.query
  const db = req.app.locals.db

  try {
    const searchTerm = `%${q}%`
    const products = db.prepare(`
      SELECT p.*, u.username as seller_name, u.school as seller_school, u.phone as seller_phone
      FROM products p
      JOIN users u ON p.seller_id = u.id
      WHERE p.title LIKE ? OR p.description LIKE ?
      ORDER BY p.created_at DESC
    `).all(searchTerm, searchTerm)

    res.json(products)
  } catch (error) {
    console.error('搜尋商品錯誤:', error)
    res.status(500).json({ message: '搜尋失敗' })
  }
})

// 取得我的商品
router.get('/my-products', authenticateToken, (req, res) => {
  const userId = req.user.id
  const db = req.app.locals.db

  try {
    const products = db.prepare(`
      SELECT p.*, u.username as seller_name, u.school as seller_school, u.phone as seller_phone
      FROM products p
      JOIN users u ON p.seller_id = u.id
      WHERE p.seller_id = ?
      ORDER BY p.created_at DESC
    `).all(userId)

    res.json(products)
  } catch (error) {
    console.error('取得我的商品錯誤:', error)
    res.status(500).json({ message: '取得商品失敗' })
  }
})

// 取得單一商品
router.get('/:id', (req, res) => {
  const { id } = req.params
  const db = req.app.locals.db

  try {
    const product = db.prepare(`
      SELECT p.*, u.username as seller_name, u.school as seller_school, u.phone as seller_phone
      FROM products p
      JOIN users u ON p.seller_id = u.id
      WHERE p.id = ?
    `).get(id)

    if (!product) {
      return res.status(404).json({ message: '商品不存在' })
    }

    res.json(product)
  } catch (error) {
    console.error('取得商品錯誤:', error)
    res.status(500).json({ message: '取得商品失敗' })
  }
})

// 建立商品
router.post('/', authenticateToken, (req, res) => {
  const { title, description, price, category, condition, image } = req.body
  const sellerId = req.user.id
  const db = req.app.locals.db

  try {
    const result = db.prepare(
      'INSERT INTO products (seller_id, title, description, price, category, condition, image) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(sellerId, title, description, price, category, condition, image || null)

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid)

    res.status(201).json(product)
  } catch (error) {
    console.error('建立商品錯誤:', error)
    res.status(500).json({ message: '建立商品失敗' })
  }
})

// 更新商品
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params
  const { title, description, price, category, condition, image } = req.body
  const userId = req.user.id
  const db = req.app.locals.db

  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id)

    if (!product) {
      return res.status(404).json({ message: '商品不存在' })
    }

    if (product.seller_id !== userId) {
      return res.status(403).json({ message: '無權限編輯此商品' })
    }

    db.prepare(
      'UPDATE products SET title = ?, description = ?, price = ?, category = ?, condition = ?, image = ? WHERE id = ?'
    ).run(title, description, price, category, condition, image || null, id)

    const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(id)

    res.json(updatedProduct)
  } catch (error) {
    console.error('更新商品錯誤:', error)
    res.status(500).json({ message: '更新商品失敗' })
  }
})

// 刪除商品
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params
  const userId = req.user.id
  const db = req.app.locals.db

  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id)

    if (!product) {
      return res.status(404).json({ message: '商品不存在' })
    }

    if (product.seller_id !== userId) {
      return res.status(403).json({ message: '無權限刪除此商品' })
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(id)

    res.json({ message: '商品已刪除' })
  } catch (error) {
    console.error('刪除商品錯誤:', error)
    res.status(500).json({ message: '刪除商品失敗' })
  }
})

export default router

