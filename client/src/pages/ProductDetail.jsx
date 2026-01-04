import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import useAuthStore from '../store/useAuthStore'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [product, setProduct] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    fetchProduct()
    fetchComments()
    if (user) {
      checkFavorite()
    }
  }, [id, user])

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`)
      setProduct(response.data)
    } catch (error) {
      console.error('獲取商品失敗:', error)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await api.get(`/products/${id}/comments`)
      setComments(response.data)
    } catch (error) {
      console.error('獲取留言失敗:', error)
    }
  }

  const checkFavorite = async () => {
    try {
      const response = await api.get('/favorites')
      setIsFavorite(response.data.some(fav => fav.product_id === parseInt(id)))
    } catch (error) {
      console.error('檢查收藏失敗:', error)
    }
  }

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}`)
        setIsFavorite(false)
      } else {
        await api.post('/favorites', { productId: id })
        setIsFavorite(true)
      }
    } catch (error) {
      console.error('收藏操作失敗:', error)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }

    if (!newComment.trim()) return

    try {
      await api.post(`/products/${id}/comments`, { content: newComment })
      setNewComment('')
      fetchComments()
    } catch (error) {
      console.error('新增留言失敗:', error)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 商品圖片 */}
        <div className="bg-gray-200 rounded-lg overflow-hidden aspect-square">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-9xl">📦</span>
            </div>
          )}
        </div>

        {/* 商品資訊 */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-4xl font-bold text-primary-600 mb-4">
            NT$ {product.price.toLocaleString()}
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="font-semibold">分類:</span>
              <span className="bg-gray-100 px-3 py-1 rounded">{product.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">商品狀況:</span>
              <span>{product.condition}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">賣家:</span>
              <span>{product.seller_name}</span>
            </div>
            {product.seller_school && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">學校:</span>
                <span>{product.seller_school}</span>
              </div>
            )}
            {product.seller_phone && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">聯絡電話:</span>
                <span>{product.seller_phone}</span>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">商品說明</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
          </div>

          <button
            onClick={handleToggleFavorite}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              isFavorite
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
            }`}
          >
            {isFavorite ? '❤️ 已收藏' : '🤍 加入收藏'}
          </button>
        </div>
      </div>

      {/* 留言區 */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">留言</h2>

        {user && (
          <form onSubmit={handleAddComment} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="留言給賣家..."
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="mt-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              送出留言
            </button>
          </form>
        )}

        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">目前沒有留言</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{comment.username}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleString('zh-TW')}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

