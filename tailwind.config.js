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
                    50: colors.green[50],
                    100: colors.green[100],
                    200: colors.green[200],
                    300: colors.green[300],
                    400: colors.green[400],
                    500: colors.green[500],
                    600: colors.green[600],
                    700: colors.green[700],
                    800: colors.green[800],
                    900: colors.green[900],
                },
            }
        },
    },
    plugins: [],
}