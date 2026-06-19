/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      colors: {
        darkBg: '#09090b',
        darkCard: '#18181b',
        glassBorder: 'rgba(255, 255, 255, 0.08)',
        neonViolet: '#8b5cf6',
        neonEmerald: '#10b981',
        neonRose: '#f43f5e',
        neonCyan: '#06b6d4',
      },
      backgroundImage: {
        'glass-grad': 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'radial-radial': 'radial-gradient(circle at top, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow-violet': '0 0 20px rgba(139, 92, 246, 0.15)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.15)',
      }
    },
  },
  plugins: [],
}
