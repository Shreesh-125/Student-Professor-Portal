/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {},
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], 
        montserrat: ['Montserrat', 'sans-serif'],
        serif: ['Merriweather', 'serif'], 
        inter: ['Inter', 'sans-serif']
    },
  	}
  },
  plugins: [
    require('tailwindcss-animate'), // Add this plugin

            require('class-variance-authority'), // Add this plugin 

            require('clsx'), // Add this plugin

            require('tailwind-merge'), // Add this plugin
  ],
}

