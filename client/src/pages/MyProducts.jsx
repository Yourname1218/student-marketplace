import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import useAuthStore from '../store/useAuthStore'

function MyProducts() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchMyProducts()
  }, [user])

  const fetchMyProducts = async () => {
    try {
      const response = await api.get('/products/my-products')
      setProducts(response.data)
    } catch (error) {
      console.error('獲取我的商品失敗:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('確定要刪除這個商品嗎？')) return

    try {
      await api.delete(`/products/${id}`)
      setProducts(products.filter(p => p.id !== id))
    } catch (error) {
      console.error('刪除失敗:', error)
      alert('刪除失敗，請稍後再試')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">我的商品</h1>
        <Link
          to="/create-product"
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
        >
          刊登新商品
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl mb-4">您還沒有刊登任何商品</p>
          <Link
            to="/create-product"
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            立即刊登
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-48 h-48 bg-gray-200 flex-shrink-0">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-6xl">📦</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                  <p className="text-primary-600 font-bold text-2xl mb-2">
                    NT$ {product.price.toLocaleString()}
                  </p>
                  <div className="flex gap-2 mb-4">
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm">{product.category}</span>
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm">{product.condition}</span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex gap-2">
                    <Link
                      to={`/product/${product.id}`}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                    >
                      查看
                    </Link>
                    <Link
                      to={`/edit-product/${product.id}`}
                      className="bg-primary-100 text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-200 transition"
                    >
                      編輯
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition"
                    >
                      刪除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyProducts

