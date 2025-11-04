/** @type {import('tailwindcss').Config} */
module.exports = {
    // Configura os arquivos onde o Tailwind deve procurar por classes
    content: [
        "./*.html",
        "./js/**/*.js",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            // Adiciona a escala de cores 'primary' (verde customizado)
            colors: {
                primary: { 
                    '50': '#f0fff4',
                    '100': '#e0ffe8',
                    '200': '#c2ffd3',
                    '300': '#a3ffbe',
                    '400': '#72ff9f',
                    '500': '#29e361', // A cor principal: #29e361
                    '600': '#22b64d',
                    '700': '#1b8a3a',
                    '800': '#145d27',
                    '900': '#0d3115',
                    '950': '#071e0b',
                },
                // Definindo cores escuras baseadas no Tailwind padrão para o tema do dashboard
                'bg-dark': '#0f172a', // slate-900 customizado
                'card-dark': '#1e293b', // slate-800 customizado
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}