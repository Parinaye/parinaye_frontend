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
      port: 3000,
      proxy: {
        '/api': {
          target: "https://parinaye-backend.vercel.app/",
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
