// 環境變數配置
const getApiUrl = () => {
  // 生產環境：使用 Render 部署的後端 API
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || 'https://your-app-name.onrender.com'
  }
  // 開發環境：使用本地後端
  return 'http://localhost:5000'
}

export const API_URL = getApiUrl()

