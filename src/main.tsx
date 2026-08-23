import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AppDataProvider } from './context/AppDataContext.tsx'

// GitHub PagesはSPAのクライアントサイドルーティング用のサーバー側リライト設定ができないため、
// URLの#以降だけでルーティングが完結するHashRouterを採用している（例: /#/events/xxx）。
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <AppDataProvider>
        <App />
      </AppDataProvider>
    </HashRouter>
  </StrictMode>,
)
