import { Link } from 'react-router-dom'

function ProductCard({ product }) {
  // 根據分類返回對應的圖示
  const getCategoryIcon = (category) => {
    const icons = {
      '教科書': '📚',
      '3C產品': '💻',
      '文具用品': '✏️',
      '生活用品': '🏠',
      '運動器材': '⚽',
      '其他': '🎁'
    }
    return icons[category] || '📦'
  }

  // 根據狀況返回對應的顏色
  const getConditionColor = (condition) => {
    const colors = {
      '全新': 'bg-green-100 text-green-800',
      '九成新': 'bg-blue-100 text-blue-800',
      '八成新': 'bg-yellow-100 text-yellow-800',
      '七成新以下': 'bg-gray-100 text-gray-800'
    }
    return colors[condition] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
            <span className="text-8xl group-hover:scale-110 transition-transform duration-300">
              {getCategoryIcon(product.category)}
            </span>
          </div>
        )}
        {/* 狀況標籤 */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getConditionColor(product.condition)} backdrop-blur-sm bg-opacity-90`}>
            {product.condition}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.title}
        </h3>
        
        <div className="flex items-baseline gap-2 mb-3">
          <p className="text-primary-600 font-bold text-2xl">
            ${product.price.toLocaleString()}
          </p>
          <span className="text-gray-500 text-sm">TWD</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-lg font-medium text-gray-700">
            <span>{getCategoryIcon(product.category)}</span>
            <span>{product.category}</span>
          </span>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {product.seller_name}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard

