/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#007bff', // Example blue
                secondary: '#6c757d',
            }
        },
    },
    plugins: [],
    darkMode: 'class',
}
