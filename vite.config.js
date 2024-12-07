import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import EnvCompatible from "vite-plugin-env-compatible";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), EnvCompatible()],
});
