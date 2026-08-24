import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base を絶対パス（例: '/MASUDA_event_portal/'）で固定すると、GitHub Pagesの
// サブパス以外の場所（ローカルでのビルドプレビュー、別のリポジトリ名、独自ドメイン等）で
// 開いたときにJS/CSSが読み込めず白画面になる。相対パスにしておけば、
// index.html が置かれた場所を基準にアセットを解決するためどこに配置しても動く。
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
})
