/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                mueen: {
                    cyan: '#00E5FF',
                    blue: '#2979FF',
                    dark: '#090314',
                    glass: 'rgba(26, 11, 60, 0.45)',
                }
            },
            animation: {
                'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
