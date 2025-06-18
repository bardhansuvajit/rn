/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    // content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: colors.red[50],
                    100: colors.red[100],
                    200: colors.red[200],
                    300: colors.red[300],
                    400: colors.red[400],
                    500: colors.red[500],
                    600: colors.red[600],
                    700: colors.red[700],
                    800: colors.red[800],
                    900: colors.red[900],
                },
            }
        },
    },
    plugins: [],
}