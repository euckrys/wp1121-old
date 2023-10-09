import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import "dotenv/config";
import tsconfigPaths from "vite-tsconfig-paths";

if (process.env.VITE_API_URL === undefined) {
  throw new Error("the environment variable VITE_API_URL is not defined");
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
})
