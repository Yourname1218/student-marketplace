import { useState, useEffect } from 'react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

const categories = ['全部', '教科書', '3C產品', '文具用品', '生活用品', '運動器材', '其他']
const conditions = ['全部', '全新', '九成新', '八成新', '七成新以下']

function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [selectedCondition, setSelectedCondition] = useState('全部')

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, selectedCondition])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = {}
      if (selectedCategory !== '全部') params.category = selectedCategory
      if (selectedCondition !== '全部') params.condition = selectedCondition
      
      const response = await api.get('/products', { params })
      setProducts(response.data)
    } catch (error) {
      console.error('獲取商品失敗:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) {
      fetchProducts()
      return
    }
    
    try {
      setLoading(true)
      const response = await api.get('/products/search', {
        params: { q: searchTerm }
      })
      setProducts(response.data)
    } catch (error) {
      console.error('搜尋失敗:', error)
    } finally {
      setLoading(false)
    }
  }

  const categoryIcons = {
    '全部': '🎯',
    '教科書': '📚',
    '3C產品': '💻',
    '文具用品': '✏️',
    '生活用品': '🏠',
    '運動器材': '⚽',
    '其他': '🎁'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 精美橫幅 */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              🎓 學生二手市集
            </h1>
            <p className="text-xl md:text-2xl text-primary-50 mb-8">
              買賣交流 · 環保永續 · 學生專屬
            </p>
            
            {/* 搜尋列 */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="flex gap-2 bg-white rounded-xl p-2 shadow-2xl">
                <input
                  type="text"
                  placeholder="搜尋你想要的商品..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-6 py-4 text-gray-900 rounded-lg focus:outline-none text-lg"
                />
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  🔍 搜尋
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 快速分類選擇 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">🏷️ 熱門分類</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat)
                  setSearchTerm('')
                }}
                className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all transform hover:scale-105 ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white shadow-lg scale-105'
                    : 'bg-white hover:bg-primary-50 text-gray-700 shadow-md'
                }`}
              >
                <span className="text-3xl mb-2">{categoryIcons[cat]}</span>
                <span className="text-sm font-semibold text-center">{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 進階篩選 */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">🔧 進階篩選</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">商品狀況</label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedCategory('全部')
                  setSelectedCondition('全部')
                  setSearchTerm('')
                  fetchProducts()
                }}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
              >
                🔄 重置篩選
              </button>
            </div>
          </div>
        </div>

        {/* 商品數量統計 */}
        {!loading && (
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              ✨ {selectedCategory === '全部' ? '所有商品' : selectedCategory}
            </h2>
            <span className="text-gray-600 font-medium">
              共 {products.length} 個商品
            </span>
          </div>
        )}

        {/* 商品列表 */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 font-medium">載入中...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-4">🔍</div>
            <p className="text-2xl font-bold text-gray-700 mb-2">找不到商品</p>
            <p className="text-gray-500 mb-6">試試其他搜尋條件或分類吧！</p>
            <button
              onClick={() => {
                setSelectedCategory('全部')
                setSelectedCondition('全部')
                setSearchTerm('')
                fetchProducts()
              }}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-all font-semibold"
            >
              查看所有商品
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home

