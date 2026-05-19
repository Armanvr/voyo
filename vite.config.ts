import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [preact(), tailwindcss()],
	define: {
		'process.env': '{}',
		'process.platform': '"browser"',
		'process.version': '"v0.0.0"',
		global: 'globalThis',
	},
})
