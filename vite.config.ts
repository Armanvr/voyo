import { fileURLToPath } from 'node:url'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [preact(), tailwindcss()],
	resolve: {
		alias: {
			events: fileURLToPath(new URL('./src/polyfills/events.ts', import.meta.url)),
		},
	},
	define: {
		'process.env': '{}',
		'process.platform': '"browser"',
		'process.version': '"v0.0.0"',
		global: 'globalThis',
	},
})
