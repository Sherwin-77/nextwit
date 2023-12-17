import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
          "google": "conic-gradient(#ea4335 0turn 0.125turn,#4285f4 0.125turn 0.25turn,#fbbc05 0.25turn 0.375turn  ,#34a853 0.375turn 0.5turn,#ea4335 0.5turn 0.625turn,#4285f4 0.625turn 0.75turn,#fbbc05 0.75turn 0.875turn,#34a853 0.875turn 1turn);",
        },
      boxShadow: {
        "neon": "0px 1px 2px 0px rgba(0,255,255,0.7), 0px -1px 4px 0px rgba(0,255,255,0.7), 2px 4px 8px 0px rgba(0,255,255,0.7), 2px 4px 16px 0px rgba(0,255,255,0.7);",
        "neon-top": "inset 0px 5px 10px 0px rgba(0,255,255,0.7)"
      },
      animation: {
        "spin-slow": "custom-spin 5s linear infinite"
      },
      keyframes: {
        "custom-spin": {
          "from": {
            transform: "translate(-50%, -50%) rotate(0)"
          },
          "to": {
            transform: "translate(-50%, -50%) rotate(360deg)"
          }
        }
      }
    },
  },
  plugins: [],
}
export default config
