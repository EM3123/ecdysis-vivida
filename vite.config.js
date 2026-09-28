import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Vite does not read PORT on its own. The launch config runs with autoPort, so the
// harness assigns a free port through the environment and we have to honour it
// exactly — otherwise Vite would fall back to 5173, find it taken, and silently
// drift to 5174 while the preview looked for the assigned port.
const assigned = Number(process.env.PORT) || undefined

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: assigned ?? 5173,
    // Fail loudly rather than drift when the port was handed to us; keep the
    // usual auto-increment for a plain `npm run dev` in a terminal.
    strictPort: assigned !== undefined,
  },
})
