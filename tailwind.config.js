
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // EcoHop Colors
        'eco-green': {
          '50': '#f0f9ee',
          '100': '#ddf0d9',
          '200': '#bce2b8',
          '300': '#90cd8a',
          '400': '#61b155',
          '500': '#429333',
          '600': '#2E7D32', // Primary green
          '700': '#246428',
          '800': '#1f4f22',
          '900': '#1c431f',
        },
        'eco-blue': {
          '50': '#eef3fb',
          '100': '#d7e4f5',
          '200': '#b7ceec',
          '300': '#8aafdf',
          '400': '#5a88cf',
          '500': '#3d67be',
          '600': '#1976D2', // Primary blue
          '700': '#244eac',
          '800': '#234080',
          '900': '#213a67',
        },
        'eco-amber': {
          '50': '#fff9eb',
          '100': '#ffefc7',
          '200': '#ffe290',
          '300': '#ffcf5c',
          '400': '#feba2e',
          '500': '#f99808',
          '600': '#dd7503',
          '700': '#b75105',
          '800': '#953d0c',
          '900': '#7a330d',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
