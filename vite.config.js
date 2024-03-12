import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';

// https://vitejs.dev/config/
// export default defineConfig({
  

//   plugins: [react()],
// })
export default ({mode}) =>{
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  return defineConfig({
    server: {
      proxy: {
        '/api': {
          target: process.env.MY_BACKEND_URL,
          secure: false,
        },
    }},
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [react()],
});
}
