import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages (https://<user>.github.io/MASUDA_event_portal/) にプロジェクトサイトとして
// 公開するため、本番ビルドのみアセットパスをリポジトリ名のサブパスに合わせる。
// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/MASUDA_event_portal/' : '/',
}))
